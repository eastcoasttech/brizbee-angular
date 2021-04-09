app.controller('PunchesController', function ($http, $location, $rootScope, $scope, $uibModal, $window) {
    $scope.active = 0
    $scope.commits = []
    $scope.datepicker = { in_at: {}, out_at: {}, options: {} }
    $scope.filters = { customer: {}, job: {}, task: {}, user: { users: [] } }
    $scope.loading = { commits: false, punches: false }
    $scope.punches = []
    $scope.punchesPageSkip = 0;
    $scope.punchesPageSize = 200;
    $scope.sortDirection = 'asc'
    $scope.sortType = 'Punches/InAt'
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
        // return $scope.punchesPageStart + $scope.punchesPageCount < $scope.punchesCount ? $scope.punchesPageStart + $scope.punchesPageCount : $scope.punchesCount;
        return $scope.punchesPageSkip + $scope.punchesPageSize < $scope.punchesCount ? $scope.punchesPageSkip + $scope.punchesPageSize : $scope.punchesCount;
    };

    $scope.punchesNext = function () {
        // $scope.punchesPageStart = $scope.punchesPageStart + $scope.punchesPageCount
        // $scope.refreshPunches()
        $scope.punchesPageSkip = $scope.punchesPageSkip + $scope.punchesPageSize;
        $scope.skip = $scope.punchesPageSkip;
        $scope.refreshPunches();
    }
    
    $scope.punchesPrevious = function () {
        // $scope.punchesPageStart = $scope.punchesPageStart - $scope.punchesPageCount
        // $scope.refreshPunches()
        $scope.punchesPageSkip = $scope.punchesPageSkip - $scope.punchesPageSize;
        $scope.skip = $scope.punchesPageSkip;
        $scope.refreshPunches();
    }

    $scope.punchesStart = function () {
        return $scope.punchesPageSkip + 1
    }

    $scope.refreshCount = function () {
        var ms = 0;
        for (var i = 0; i < $scope.punches.length; i++) {
            var inAt = moment($scope.punches[i].InAt)
            var outAt = moment($scope.punches[i].OutAt)
            ms += outAt.diff(inAt)
        }
        var minutes = moment.duration(ms).asMinutes()
        hours = Math.floor(minutes / 60)
        remainder = minutes % 60
        $scope.count = hours.toString() + " hours and " + remainder.toString() + " minutes"
    }
    
    $scope.refreshPunches = function () {
        $scope.punches = []
        $scope.refreshCount()
        $scope.loading.punches = true

        // Filter by user
        var filters = { in_at: { $gte: $rootScope.range.InAt,
                                 $lte: $rootScope.range.OutAt } }
        if ($scope.filters['user'].selected) {
            filters.user_id = { $in: $scope.filters['user'].users.map(x => x._id) }
        }

        var url = $rootScope.baseUrl + "/api/PunchesExpanded?inAt=" + $scope.formatMomentFromDate($rootScope.range.InAt, 'YYYY-MM-DDTHH:mm:ss-00:00') + "&outAt=" + $scope.formatMomentFromDate($rootScope.range.OutAt, 'YYYY-MM-DDTHH:mm:ss-00:00') + "&orderBy=" + $scope.sortType + "&orderByDirection=" + $scope.sortDirection + "&pageSize=" + $scope.punchesPageSize + "&skip=" + $scope.punchesPageSkip;
        $http.get(url)
            .then(response => {
                $scope.loading.punches = false
                $scope.punchesCount = response.headers("X-Paging-TotalRecordCount")
                $scope.punches = response.data
                $scope.refreshCount()
            }, error => {
                $scope.loading.punches = false
                $scope.refreshCount()
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
                alert('Punches were successfully locked.')
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
            .then(() => {
                $scope.refreshPunches()
            }, () => {
                // dismissed
            })
    }

    $scope.showDownload = function () {
        var instance = $uibModal.open({
            templateUrl: '/pages/modals/download.html',
            controller: 'ModalDownloadController',
            resolve: {
                range: function () {
                    return $rootScope.range
                }
            }
        });
        
        instance.result
            .then(() => {
                // success
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
                $scope.refreshPunches()
            }, () => {
                // dismissed
            })
    };

    $scope.showSplitMidnight = function () {
        var instance = $uibModal.open({
            templateUrl: '/pages/modals/split-midnight.html',
            controller: 'ModalSplitMidnightController',
            resolve: { }
        });
        
        instance.result
            .then(() => {
                $scope.refreshPunches()
            }, () => {
                // dismissed
            })
    };

    $scope.showPopulateRates = function () {
        var instance = $uibModal.open({
            templateUrl: '/pages/modals/populate-rates.html',
            controller: 'ModalPopulateRatesController',
            size: 'lg',
            resolve: { }
        });
        
        instance.result
            .then(() => {
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
        var instance = $uibModal.open({
            templateUrl: '/pages/details/commit.html',
            controller: 'CommitDetailsController',
            resolve: {
                commit: function () {
                    return {};
                }
            }
        });

        instance.result
            .then((msg) => {
                $location.path('/commits')
            }, () => {
                // dismissed
            })
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
            .then(() => {
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

    $scope.formatMinutes = function (minutes) {
        return (parseInt(minutes) / 60.0).toFixed(2);
    };

    $scope.refreshPunches()

    // Scroll to top
    $window.scrollTo(0, 0)
});
