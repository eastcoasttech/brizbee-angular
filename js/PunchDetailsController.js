app.controller('PunchDetailsController', function ($filter, $http, $rootScope, $scope, $uibModalInstance, $uibModal, punch) {
    $scope.customers = []
    $scope.datepicker = { InAt: {}, OutAt: {}, options: {} }
    $scope.jobs = []
    $scope.loading = { customers: false, jobs: false, tasks: false, users: false }
    $scope.tasks = []
    $scope.working = { save: false }

    if (punch.Id == null) {
        $scope.punch = {
            InAt: moment().startOf('day').millisecond(0).toDate(),
            OutAt: moment().endOf('day').millisecond(0).toDate(),
            has_out_at: true
        }
    } else {
        var timedifference = new Date().getTimezoneOffset(); // Offset the browser time

        $scope.punch = angular.copy(punch)
        $scope.punch.Job = $scope.punch.Task.Job
        $scope.punch.Customer = $scope.punch.Task.Job.Customer
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
        var operatingSystemVersion = platform.os.version + (platform.os.architecture == 64 ? ' 64-bit' : ''); // 5.0
        
        var json = {
            InAt: moment($scope.punch.InAt).format('YYYY-MM-DDTHH:mm:00') + 'Z',
            InAtTimeZone: $scope.punch.InAtTimeZone,
            InAtSourceHardware: "Dashboard",
            InAtSourceOperatingSystem: operatingSystem,
            InAtSourceOperatingSystemVersion: operatingSystemVersion,
            InAtSourceBrowser: browserName,
            InAtSourceBrowserVersion: browserVersion,
            TaskId: $scope.punch.Task.Id,
            UserId: $scope.punch.User.Id
        };

        // OutAt is optional when editing manually
        if ($scope.punch.has_out_at) {
            json.OutAt = moment($scope.punch.OutAt).format('YYYY-MM-DDTHH:mm:00') + 'Z';
            json.OutAtTimeZone = $scope.punch.OutAtTimeZone;
            json.OutAtSourceHardware = "Dashboard";
            json.OutAtSourceOperatingSystem = operatingSystem;
            json.OutAtSourceOperatingSystemVersion = operatingSystemVersion;
            json.OutAtSourceBrowser = browserName;
            json.OutAtSourceBrowserVersion = browserVersion;
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
            TaskId: $scope.punch.Task.Id,
            UserId: $scope.punch.User.Id
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
        $http.get($rootScope.baseUrl + "/odata/Customers?$orderby=Number")
            .then(response => {
                $scope.loading.customers = false
                $scope.customers = response.data.value
                if (!$scope.punch.Customer) {
                    $scope.punch.Customer = $scope.customers[0]
                } else {
                    $scope.punch.Customer = $filter('filter')($scope.customers, { Id: $scope.punch.Task.Job.Customer.Id }, true)[0]
                }
                $scope.refreshJobs()
            }, error => {
                $scope.loading.customers = false
                console.error(error)
            })
    }

    $scope.refreshJobs = function () {
        if ($scope.punch.Customer == null)
        {
            return;
        }

        $scope.jobs = []
        $scope.tasks = []
        $scope.loading.jobs = true
        $http.get($rootScope.baseUrl + "/odata/Jobs?$orderby=Number&$filter=CustomerId eq " + $scope.punch.Customer.Id)
            .then(response => {
                $scope.loading.jobs = false
                $scope.jobs = response.data.value
                if (!$scope.punch.Job) {
                    $scope.punch.Job = $scope.jobs[0]
                } else {
                    $scope.punch.Job = $filter('filter')($scope.jobs, { Id: $scope.punch.Task.Job.Id }, true)[0]
                }
                $scope.refreshTasks()
            }, error => {
                $scope.loading.jobs = false
                console.error(error)
            })
    };

    $scope.refreshTasks = function () {
        if ($scope.punch.Job == null) {
            return;
        }

        $scope.tasks = []
        $scope.loading.tasks = true
        $http.get($rootScope.baseUrl + "/odata/Tasks?$orderby=Number&$filter=JobId eq " + $scope.punch.Job.Id)
            .then(response => {
                $scope.loading.tasks = false
                $scope.tasks = response.data.value
                if (!$scope.punch.Task) {
                    $scope.punch.Task = $scope.tasks[0]
                } else {
                    $scope.punch.Task = $filter('filter')($scope.tasks, { Id: $scope.punch.Task.Id }, true)[0]
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
                if (!$scope.punch.User) {
                    $scope.punch.User = $scope.users[0]
                    $scope.punch.InAtTimeZone = $scope.punch.User.TimeZone
                    $scope.punch.OutAtTimeZone = $scope.punch.User.TimeZone
                } else {
                    $scope.punch.User = $filter('filter')($scope.users, { Id: $scope.punch.User.Id }, true)[0]
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
