app.controller('PunchesController', function ($http, $rootScope, $scope, $uibModal, $window) {
    $scope.active = 0
    $scope.commits = []
    $scope.datepicker = { in_at: {}, out_at: {}, options: {} }
    $scope.filters = { customer: {}, job: {}, task: {}, user: { users: [] } }
    $scope.loading = { commits: false, punches: false }
    $scope.punches = []
    $scope.punchesPageStart = 0
    $scope.sortDirection = 'asc'
    $scope.sortType = 'InAt'
    $scope.working = { commit: false }

    // Reset the document title, in case the session expired
    $(document).prop('title', 'Dashboard - BRIZBEE')

    $scope.filterCount = function () {
        var count = 0
        angular.forEach($scope.filters, function (value, key) {
            if (value.selected == true) {
                count++
            }
        })
        return count
    }
    
    $scope.punchesEnd = function () {
        return $scope.punchesPageStart + 20 < $scope.punchesCount ? $scope.punchesPageStart + 20 : $scope.punchesCount;
    };

    $scope.punchesNext = function () {
        $scope.punchesPageStart = $scope.punchesPageStart + 20
        $scope.refreshPunches()
    }
    
    $scope.punchesPrevious = function () {
        $scope.punchesPageStart = $scope.punchesPageStart - 20
        $scope.refreshPunches()
    }

    $scope.punchesStart = function () {
        return $scope.punchesPageStart + 1
    }

    $scope.refreshCommits = function () {
        $scope.commits = []
        $scope.loading.commits = true
        $http.get($rootScope.baseUrl + "/odata/Commits?$orderby=InAt desc&$expand=User")
            .then(response => {
                $scope.loading.commits = false
                $scope.commits = response.data.value
            }, error => {
                $scope.loading.commits = false
                console.error(error)
            })
    }
    
    $scope.refreshPunches = function () {
        $scope.punches = []
        $scope.loading.punches = true

        // Filter by user
        var filters = { in_at: { $gte: $rootScope.range.InAt,
                                 $lte: $rootScope.range.OutAt } }
        if ($scope.filters['user'].selected) {
            filters.user_id = { $in: $scope.filters['user'].users.map(x => x._id) }
        }

        var sortParameter = {}
        sortParameter[$scope.sortType] = $scope.sortDirection

        $http.get($rootScope.baseUrl + "/odata/Punches?$count=true&$expand=User,Task($expand=Job($expand=Customer))&$top=20&$skip=" + $scope.punchesPageStart + "&$filter=InAt ge " + $scope.formatMomentFromDate($rootScope.range.InAt, 'YYYY-MM-DDTHH:mm:ss-00:00') + " and InAt le " + $scope.formatMomentFromDate($rootScope.range.OutAt, 'YYYY-MM-DDTHH:mm:ss-00:00') + '&$orderby=' + $scope.sortType + ' ' + $scope.sortDirection)
            .then(response => {
                $scope.loading.punches = false
                $scope.punchesCount = response.data["@odata.count"]
                $scope.punches = response.data.value
            }, error => {
                $scope.loading.punches = false
                console.error(error)
            })
    }

    $scope.setSortType = function (sortType) {
        $scope.sortType = sortType
        if ($scope.sortDirection == 'asc') {
            $scope.sortDirection = 'desc'
        } else {
            $scope.sortDirection = 'asc'
        }
        $scope.refreshPunches()
    }

    $scope.saveCommit = function () {
        $scope.working.commit = true

        var json = { InAt: moment($rootScope.range.InAt).format("YYYY-MM-DD"), OutAt: moment($rootScope.range.OutAt).format("YYYY-MM-DD") }
        $http.post($rootScope.baseUrl + "/odata/Commits", JSON.stringify(json))
            .then(response => {
                // Refresh the punches and commits
                $scope.refreshPunches()
                $scope.refreshCommits()
                $scope.working.commit = false
                alert('Punches were successfully committed')
                $scope.active = 1
            }, error => {
                $scope.working.commit = false
                if (error.data.error.message)
                {
                    alert(error.data.error.message)
                }
                console.error(error)
            })
    }

    $scope.showEditPunch = function (punch) {
        var instance = $uibModal.open({
            templateUrl: '/pages/details/punch.html',
            controller: 'PunchDetailsController',
            resolve: {
                punch: function () {
                    return punch;
                }
            }
        });

        instance.result
            .then((msg) => {
                $scope.refreshPunches()
            }, () => {
                // dismissed
            })
    }

    $scope.showExport = function () {
        var instance = $uibModal.open({
            templateUrl: '/pages/export.html',
            controller: 'ExportController',
            resolve: {
                range: function () {
                    return $rootScope.range
                }
            }
        });
        
        instance.result
            .then((msg) => {
                console.log(msg)
            }, () => {
                // dismissed
            })
    }

    $scope.showFilters = function () {
        var instance = $uibModal.open({
            templateUrl: '/pages/filters/punches.html',
            controller: 'PunchesFiltersController',
            resolve: {
                filters: function () {
                    return $scope.filters
                }
            }
        });
        
        instance.result
            .then((msg) => {
                $scope.refreshPunches()
            }, () => {
                // dismissed
            })
    };

    $scope.showSplit = function () {
        var instance = $uibModal.open({
            templateUrl: '/pages/split.html',
            controller: 'SplitController',
            resolve: {
                // filters: function () {
                //     return $scope.filters
                // }
            }
        });
        
        instance.result
            .then((msg) => {
                console.log(msg)
                $scope.refreshPunches()
            }, () => {
                // dismissed
            })
    };
    
    $scope.showOutAtDatepicker = function () {
        $scope.datepicker.out_at.opened = true
    }

    $scope.showInAtDatepicker = function () {
        $scope.datepicker.in_at.opened = true
    }

    $scope.showNewCommit = function () {
        $scope.active = 2
    }

    $scope.showNewPunch = function () {
        var instance = $uibModal.open({
            templateUrl: '/pages/details/punch.html',
            controller: 'PunchDetailsController',
            resolve: {
                punch: function () {
                    return {};
                }
            }
        });

        instance.result
            .then((msg) => {
                console.log(msg)
                $scope.refreshPunches()
            }, () => {
                // dismissed
            })
    }

    $scope.showRange = function () {
        var instance = $uibModal.open({
            templateUrl: '/pages/range.html',
            controller: 'RangeController',
            resolve: {
                range: function () {
                    return $rootScope.range
                }
            }
        });
        
        instance.result
            .then((range) => {
                $rootScope.range = range
                $scope.refreshPunches()
            }, () => {
                // dismissed
            })
    }

    $scope.undo = function (commit) {
        if (confirm("Are you sure you want to undo this commit? All the punches will be editable again?")) {

            $http.post($rootScope.baseUrl + "/odata/Commits(" + commit.Id + ")/Default.Undo")
                .then(response => {
                    // Refresh the punches and commits
                    $scope.refreshPunches()
                    $scope.refreshCommits()
                    $scope.working.commit = false
                    alert('Punches were successfully committed')
                }, error => {
                    console.error(error)
                })
        }
    }

    $scope.refreshCommits()
    $scope.refreshPunches()

    // Scroll to top
    $window.scrollTo(0, 0)
});
