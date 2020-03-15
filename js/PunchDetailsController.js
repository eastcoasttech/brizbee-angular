app.controller('PunchDetailsController', function ($filter, $http, $rootScope, $scope, $uibModalInstance, $uibModal, punch) {
    $scope.customers = []
    $scope.datepicker = { InAt: {}, OutAt: {}, options: {} }
    $scope.jobs = []
    $scope.loading = { customers: false, jobs: false, tasks: false }
    $scope.tasks = []
    $scope.working = { save: false }

    if (punch.Id == null) {
        // var startOfDay = moment().startOf('day').millisecond(0);
        // var startOfDayAsDate = new Date(startOfDay.year(), startOfDay.month(), startOfDay.date(), startOfDay.hour(), startOfDay.minute(), 0, 0);
        
        // var endOfDay = moment().endOf('day').millisecond(0);
        // var endOfDayAsDate = new Date(endOfDay.year(), endOfDay.month(), endOfDay.date(), endOfDay.hour(), endOfDay.minute(), 0, 0);

        $scope.punch = {
            InAt: moment().startOf('day').millisecond(0).toDate(),
            OutAt: moment().endOf('day').millisecond(0).toDate(),
            has_out_at: true
        }
    } else {
        var timedifference = new Date().getTimezoneOffset(); // Offset the browser time

        $scope.punch = angular.copy(punch)
        $scope.punch.InAt = moment(punch.InAt).add(timedifference, 'm').toDate()
        if ($scope.punch.OutAt != null) {
            $scope.punch.OutAt = moment(punch.OutAt).add(timedifference, 'm').toDate()
            $scope.punch.has_out_at = true
        }
    }

    $scope.delete = function () {
        if (confirm("Are you sure you want to delete this punch?")) {
            $http.delete($rootScope.baseUrl + "/odata/Punches(" + $scope.punch.Id + ")")
                .then(response => {
                    $scope.ok(true)
                }, error => {
                    console.error(error)
                });
        }
    }

    $scope.save = function () {
        if (punch.Id == null) {
            $scope.saveNewPunch()
        } else {
            $scope.saveExistingPunch()
        }
    };

    $scope.saveNewPunch = function () {
        // Platform detection
        var browserName = platform.name; // 'Safari'
        var browserVersion = platform.version; // '5.1'
        var operatingSystem = platform.os.family; // 'iOS'
        var operatingSystemVersion = platform.os.version + platform.os.architecture == 64 ? ' 64-bit' : ''; // 5.0
        
        var json = {
            InAt: moment($scope.punch.InAt).format('YYYY-MM-DDTHH:mm:00') + 'Z',
            InAtTimeZone: $scope.punch.InAtTimeZone,
            InAtSourceHardware: "Dashboard",
            InAtSourceOperatingSystem: operatingSystem,
            InAtSourceOperatingSystemVersion: operatingSystemVersion,
            InAtSourceBrowser: browserName,
            InAtSourceBrowserVersion: browserVersion,
            TaskId: $scope.punch.task.Id,
            UserId: $scope.punch.user.Id
        };

        // OutAt is optional when editing manually
        if ($scope.punch.has_out_at) {
            json.OutAt = moment($scope.punch.OutAt).format('YYYY-MM-DDTHH:mm:00') + 'Z';
            json.OutAtTimeZone = $scope.punch.OutAtTimeZone;
            json.OutAtSourceHardware = "Dashboard";
            json.InAtSourceOperatingSystem = operatingSystem;
            json.InAtSourceOperatingSystemVersion = operatingSystemVersion;
            json.InAtSourceBrowser = browserName;
            json.InAtSourceBrowserVersion = browserVersion;
        }

        if (confirm("Are you sure you want to save this new punch?")) {
            $http.post($rootScope.baseUrl + "/odata/Punches", JSON.stringify(json))
                .then(response => {
                    $scope.ok()
                }, error => {
                    console.error(error)
                });
        }
    };

    $scope.saveExistingPunch = function () {
        // Platform detection
        var browserName = platform.name; // 'Safari'
        var browserVersion = platform.version; // '5.1'
        var operatingSystem = platform.os.toString(); // 'iOS 5.0'

        var timedifference = new Date().getTimezoneOffset();
        var json = {
            InAt: moment($scope.punch.InAt).subtract(timedifference, 'm').toDate(),
            InAtTimeZone: $scope.punch.InAtTimeZone,
            TaskId: $scope.punch.task.Id,
            UserId: $scope.punch.user.Id
            // Do not change source details
        };

        // OutAt is optional when editing manually
        if ($scope.punch.has_out_at) {
            json.OutAt = moment($scope.punch.OutAt).subtract(timedifference, 'm').toDate()
            json.OutAtTimeZone = $scope.punch.OutAtTimeZone
        } else {
            json.OutAt = null
            json.OutAtTimeZone = null
        }

        if (confirm("Are you sure you want to modify this punch?")) {
            $http.patch($rootScope.baseUrl + "/odata/Punches(" + $scope.punch.Id + ")", JSON.stringify(json))
                .then(response => {
                    $scope.ok()
                }, error => {
                    console.error(error)
                });
        }
    };

    $scope.ok = function () {
        $uibModalInstance.close()
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss()
    }

    $scope.refreshCustomers = function () {
        $scope.customers = []
        $scope.loading.customers = true
        $http.get($rootScope.baseUrl + "/odata/Customers?$orderby=Id")
            .then(response => {
                $scope.loading.customers = false
                $scope.customers = response.data.value
                if (!$scope.punch.customer) {
                    $scope.punch.customer = $scope.customers[0]
                } else {
                    $scope.punch.customer = $filter('filter')($scope.customers, { Id: $scope.punch.customer.Id }, true)[0]
                }
                $scope.refreshJobs()
            }, error => {
                $scope.loading.customers = false
                console.error(error)
            })
    }

    $scope.refreshJobs = function () {
        if ($scope.punch.customer == null)
        {
            return;
        }

        $scope.jobs = []
        $scope.tasks = []
        $scope.loading.jobs = true
        $http.get($rootScope.baseUrl + "/odata/Jobs?$orderby=Id&$filter=CustomerId eq " + $scope.punch.customer.Id)
            .then(response => {
                $scope.loading.jobs = false
                $scope.jobs = response.data.value
                if (!$scope.punch.job) {
                    $scope.punch.job = $scope.jobs[0]
                } else {
                    $scope.punch.job = $filter('filter')($scope.jobs, { Id: $scope.punch.job.Id }, true)[0]
                }
                $scope.refreshTasks()
            }, error => {
                $scope.loading.jobs = false
                console.error(error)
            })
    };

    $scope.refreshTasks = function () {
        if ($scope.punch.job == null) {
            return;
        }

        $scope.tasks = []
        $scope.loading.tasks = true
        $http.get($rootScope.baseUrl + "/odata/Tasks?$orderby=Id&$filter=JobId eq " + $scope.punch.job.Id)
            .then(response => {
                $scope.loading.tasks = false
                $scope.tasks = response.data.value
                if (!$scope.punch.task) {
                    $scope.punch.task = $scope.tasks[0]
                } else {
                    $scope.punch.task = $filter('filter')($scope.tasks, { Id: $scope.punch.task.Id }, true)[0]
                }
            }, error => {
                $scope.loading.tasks = false
                console.error(error)
            })
    }

    $scope.refreshUsers = function () {
        $scope.users = []
        $scope.loading.users = true
        $http.get($rootScope.baseUrl + "/odata/Users?$orderby=Id")
            .then(response => {
                $scope.loading.users = false
                $scope.users = response.data.value
                if (!$scope.punch.user) {
                    $scope.punch.user = $scope.users[0]
                    $scope.punch.InAtTimeZone = $scope.punch.user.TimeZone
                    $scope.punch.OutAtTimeZone = $scope.punch.user.TimeZone
                } else {
                    $scope.punch.user = $filter('filter')($scope.users, { Id: $scope.punch.user.Id }, true)[0]
                }
            }, error => {
                $scope.loading.users = false
                console.error(error)
            })
    }
    
    $scope.showInAtDatepicker = function () {
        $scope.datepicker.InAt.opened = true
    }

    $scope.showOutAtDatepicker = function () {
        $scope.datepicker.OutAt.opened = true
    }
    
    $scope.showMap = function () {
        var instance = $uibModal.open({
            templateUrl: '/pages/details/map.html',
            controller: 'MapController',
            resolve: {
                punch: function () {
                    return $scope.punch;
                }
            }
        });
    }

    $scope.refreshUsers()
    $scope.refreshCustomers()
});
