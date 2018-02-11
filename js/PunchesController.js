app.controller('PunchesController', function ($http, $rootScope, $scope, $uibModal, $window) {
    $scope.active = 0
    $scope.commits = []
    $scope.datepicker = { in_at: {}, out_at: {}, options: {} }
    $scope.filters = { customer: {}, job: {}, task: {}, user: { users: [] } }
    $scope.loading = { commits: false, punches: false }
    $scope.punches = []
    $scope.sortDirection = 1
    $scope.sortType = 'user_name'
    $scope.working = { commit: false }

    $scope.export = function () {
        // var rows = ['User', 'In', 'Out', 'Customer', 'Job', 'Task', 'Committed']

        $http.get($rootScope.baseUrl + "odata/Punches/CSV")
            .then(response => {

            }, error => {
                console.error(error)
            })
    }

    $scope.filterCount = function () {
        var count = 0
        angular.forEach($scope.filters, function (value, key) {
            if (value.selected == true) {
                count++
            }
        })
        return count
    }

    $scope.refreshCommits = function () {
        $scope.commits = []
        $scope.loading.commits = true
        $http.get($rootScope.baseUrl + "odata/Commits?$orderby=InAt desc")
            .then(response => {
                $scope.loading.commits = false
                $scope.commits = response.data
            }, error => {
                $scope.loading.commits = false
                console.error(error)
            })
    }
    
    $scope.refreshPunches = function () {
        $scope.punches = []
        $scope.loading.punches = true

        // Filter by user
        var filters = { in_at: { $gte: $rootScope.range.in_at,
                                 $lte: $rootScope.range.out_at } }
        if ($scope.filters['user'].selected) {
            filters.user_id = { $in: $scope.filters['user'].users.map(x => x._id) }
        }

        var sortParameter = {}
        sortParameter[$scope.sortType] = $scope.sortDirection
        console.log(sortParameter)

        $http.get($rootScope.baseUrl + "odata/Punches")
            .then(response => {
                $scope.loading.punches = false
                $scope.punches = response.data
            }, error => {
                $scope.loading.punches = false
                console.error(error)
            })
    }

    $scope.setSortType = function (sortType) {
        $scope.sortType = sortType
        if ($scope.sortDirection == 1) {
            $scope.sortDirection = -1
        } else {
            $scope.sortDirection = 1
        }
        $scope.refreshPunches()
    }

    $scope.saveCommit = function () {
        $scope.working.commit = true

        var json = { InAt: $rootScope.range.in_at, OutAt: $rootScope.range.out_at }
        $http.post($rootScope.baseUrl + "odata/Commits", JSON.stringify(json))
            .then(response => {
                // Refresh the punches and commits
                $scope.refreshPunches()
                $scope.refreshCommits()
                $scope.working.commit = false
                alert('Punches were successfully committed')
            }, error => {
                console.error(error)
            })

        // // Get the count of punches in this commit
        // db.collection('punches').count({ in_at: { $gte: $rootScope.range.in_at, $lte: $rootScope.range.out_at } })
        //     .then(count => {
        //         var commit = {
        //             in_at: $rootScope.range.in_at,
        //             out_at: $rootScope.range.out_at,
        //             created_at: moment().toDate(),
        //             punches_count: count,
        //             user_name: $rootScope.current.user.name,
        //             user_id: client.authedId()
        //         }
                
        //         // Create a commit and update all the punches
        //         db.collection('commits').insertOne(commit)
        //             .then(result => {
        //                 db.collection('punches').updateMany(
        //                     {
        //                         in_at: {
        //                             $gte: $rootScope.range.in_at,
        //                             $lte: $rootScope.range.out_at
        //                         }
        //                     },
        //                     { $set: { commit_id: result['insertedId'] } })
        //                     .then(result => {
        //                         // Refresh the punches and commits
        //                         $scope.refreshPunches()
        //                         $scope.refreshCommits()
        //                         $scope.working.commit = false
        //                         alert('Punches were successfully committed')
        //                     })
        //                     .catch(error => {
        //                         console.error(error)
        //                         $scope.working.commit = false
        //                     })
        //             })
        //             .catch(error => {
        //                 console.error(error)
        //                 $scope.working.commit = false
        //             })
        //     })
        //     .catch(error => {
        //         console.error(error)
        //         $scope.working.commit = false
        //     })
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
                console.log(msg)
                $scope.refreshPunches()
            }, () => {
                console.log('dismissed')
            })
    }

    $scope.showFilters = function () {
        var instance = $uibModal.open({
            templateUrl: '/pages/filters.html',
            controller: 'FiltersController',
            resolve: {
                filters: function () {
                    return $scope.filters
                }
            }
        });
        
        instance.result
            .then((msg) => {
                console.log(msg)
                $scope.refreshPunches()
            }, () => {
                console.log('dismissed')
            })
    }
    
    $scope.showOutAtDatepicker = function () {
        $scope.datepicker.out_at.opened = true
    }

    $scope.showInAtDatepicker = function () {
        $scope.datepicker.in_at.opened = true
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
                console.log('dismissed')
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
            .then((msg) => {
                console.log(msg)
                $scope.refreshPunches()
            }, () => {
                console.log('dismissed')
            })
    }

    $scope.undo = function (commit) {
        if (confirm("Are you sure you want to undo this commit? All the punches will be editable again?")) {

            $http.post($rootScope.baseUrl + "odata/Commits(" + commit.Id + ")/Undo")
                .then(response => {
                    // Refresh the punches and commits
                    $scope.refreshPunches()
                    $scope.refreshCommits()
                    $scope.working.commit = false
                    alert('Punches were successfully committed')
                }, error => {
                    console.error(error)
                })

            // db.collection('punches').updateMany(
            //     {
            //         commit_id: commit._id
            //     },
            //     { $unset: { commit_id: 1 } })
            //     .then(result => {
            //         // Delete the commit
            //         db.collection('commits').deleteOne({ _id: commit._id })
            //             .then(result => {
            //                 // Refresh the punches and commits
            //                 $scope.refreshPunches()
            //                 $scope.refreshCommits()
            //                 $scope.working.commit = false
            //             })
            //             .catch(error => {
            //                 console.error(error)
            //                 $scope.working.commit = false
            //             })
            //     })
            //     .catch(error => {
            //         console.error(error)
            //         $scope.working.commit = false
            //     })
        }
    }

    $scope.refreshCommits()
    $scope.refreshPunches()

    // Scroll to top
    $window.scrollTo(0, 0)
});
