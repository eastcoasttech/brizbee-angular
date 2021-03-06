app.controller('TimesheetsController', function ($http, $rootScope, $scope, $uibModal, $window) {
    $scope.filters = { user: {} }
    $scope.loading = { timesheetEntries: false }
    $scope.timesheetEntries = []
    $scope.timesheetEntriesPageStart = 0
    $scope.sortDirection = 'asc'
    $scope.sortType = 'EnteredAt'

    // Reset the document title, in case the session expired
    $(document).prop('title', 'Dashboard - BRIZBEE')

    $rootScope.$watch('current', function (newValue, oldValue, scope) {
        $scope.filters.user = newValue.user
        $scope.refreshTimesheetEntries()
    })
    
    $scope.formatMinutes = function (time) {
        if ($rootScope.current.user &&
            $rootScope.current.user.Organization.MinutesFormat == 'decimal') {
            return (parseInt(time) / 60).toFixed(2)
        } else {
            var hours = (parseInt(time) / 60)
            var rhours = Math.floor(hours)
            var minutes = (hours - rhours) * 60
            var rminutes = Math.round(minutes)
            return rhours + ":" + rminutes
        }
    }

    $scope.timesheetEntriesEnd = function () {
        return $scope.timesheetEntriesPageStart + 20 < $scope.timesheetEntriesCount ? $scope.timesheetEntriesPageStart + 20 : $scope.timesheetEntriesCount
    };

    $scope.timesheetEntriesNext = function () {
        $scope.timesheetEntriesPageStart = $scope.timesheetEntriesPageStart + 20
        $scope.refreshTimesheetEntries()
    }
    
    $scope.timesheetEntriesPrevious = function () {
        $scope.timesheetEntriesPageStart = $scope.timesheetEntriesPageStart - 20
        $scope.refreshTimesheetEntries()
    }

    $scope.timesheetEntriesStart = function () {
        return $scope.timesheetEntriesPageStart + 1
    }

    $scope.refreshCount = function () {
        var minutes = 0;
        for (var i = 0; i < $scope.timesheetEntries.length; i++) {
            minutes += $scope.timesheetEntries[i].Minutes
        }
        hours = Math.floor(minutes / 60)
        remainder = minutes % 60
        $scope.count = hours.toString() + " hours and " + remainder.toString() + " minutes"
    }
    
    $scope.refreshTimesheetEntries = function () {
        if (!$scope.filters.user)
        {
            return;
        }

        $scope.loading.timesheetEntries = true

        // Filter by user
        // var filters = { in_at: { $gte: $rootScope.range.InAt,
        //                          $lte: $rootScope.range.OutAt } }
        // if ($scope.filters['user'].selected) {
        //     filters.user_id = { $in: $scope.filters['user'].users.map(x => x._id) }
        // }

        var sortParameter = {}
        sortParameter[$scope.sortType] = $scope.sortDirection

        $http.get($rootScope.baseUrl + "/odata/TimesheetEntries?$count=true&$expand=User,Task($expand=Job($expand=Customer))&$top=20&$skip=" + $scope.timesheetEntriesPageStart + "&$filter=UserId eq " + $scope.filters.user.Id + "and EnteredAt ge " + $scope.formatMomentFromDate($rootScope.range.InAt, 'YYYY-MM-DDTHH:mm:ss-00:00') + " and EnteredAt le " + $scope.formatMomentFromDate($rootScope.range.OutAt, 'YYYY-MM-DDTHH:mm:ss-00:00') + '&$orderby=' + $scope.sortType + ' ' + $scope.sortDirection)
            .then(response => {
                $scope.loading.timesheetEntries = false
                $scope.timesheetEntriesCount = response.data["@odata.count"]
                $scope.timesheetEntries = response.data.value
                $scope.refreshCount()
            }, error => {
                $scope.loading.timesheetEntries = false
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
        $scope.refreshTimesheetEntries()
    }

    $scope.showEditTimesheetEntry = function (timesheetEntry) {
        var instance = $uibModal.open({
            templateUrl: '/pages/details/timesheetEntry.html',
            controller: 'TimesheetEntryDetailsController',
            resolve: {
                timesheetEntry: function () {
                    return timesheetEntry;
                }
            }
        });

        instance.result
            .then((msg) => {
                $scope.refreshTimesheetEntries()
            }, () => {
                // dismissed
            })
    }

    $scope.showFilters = function () {
        var instance = $uibModal.open({
            templateUrl: '/pages/filters/timesheets.html',
            controller: 'TimesheetsFiltersController',
            resolve: {
                user: function () {
                    return { Id: $scope.filters.user.Id, Name: $scope.filters.user.Name }
                }
            }
        });
        
        instance.result
            .then((user) => {
                $scope.filters.user = user
                $scope.refreshTimesheetEntries()
            }, () => {
                // dismissed
            })
    };

    $scope.showNewTimesheetEntry = function () {
        var instance = $uibModal.open({
            templateUrl: '/pages/details/timesheetEntry.html',
            controller: 'TimesheetEntryDetailsController',
            resolve: {
                timesheetEntry: function () {
                    return {}
                }
            }
        })

        instance.result
            .then((msg) => {
                console.log(msg)
                $scope.refreshTimesheetEntries()
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
        })
        
        instance.result
            .then((range) => {
                $rootScope.range = range
                $scope.refreshTimesheetEntries()
            }, () => {
                // dismissed
            })
    }

    // Scroll to top
    $window.scrollTo(0, 0)
})
