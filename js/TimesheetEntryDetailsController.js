app.controller('TimesheetEntryDetailsController', function ($filter, $http, $rootScope, $scope, $uibModalInstance, $window, timesheetEntry) {
    if (timesheetEntry.Id == null) {
        $scope.timesheetEntry = {
            EnteredAt: moment().startOf('day').toDate()
        }
        $scope.timesheetEntry.user = $rootScope.current.user
        $scope.time = { hours: 0, minutes: 0 }
    } else {
        $scope.timesheetEntry = angular.copy(timesheetEntry)
        $scope.timesheetEntry.user = { Id: $scope.timesheetEntry.UserId }

        // Calculate hours and minutes
        var hours = $scope.timesheetEntry.Minutes / 60;
        var minutes = $scope.timesheetEntry.Minutes % 60;

        $scope.time = { hours: hours, minutes: minutes }
    }
    $scope.datepicker = { EnteredAt: {}, options: {} }
    $scope.loading = { customers: false, jobs: false, tasks: false }
    $scope.working = { save: false }
    
    $scope.delete = function () {
        if (confirm("Are you sure you want to delete this entry?")) {
            $http.delete($rootScope.baseUrl + "/odata/TimesheetEntries(" + $scope.timesheetEntry.Id + ")")
                .then(response => {
                    $scope.ok(true)
                }, error => {
                    console.error(error)
                })
        }
    }

    $scope.refreshCustomers = function () {
        $scope.customers = []
        $scope.loading.customers = true
        $http.get($rootScope.baseUrl + "/odata/Customers?$orderby=Number")
            .then(response => {
                $scope.loading.customers = false
                $scope.customers = response.data.value
                if (!$scope.timesheetEntry.customer) {
                    $scope.timesheetEntry.customer = $scope.customers[0]
                } else {
                    $scope.timesheetEntry.customer = $filter('filter')($scope.customers, { Id: $scope.timesheetEntry.customer.Id }, true)[0]
                }
                $scope.refreshJobs()
            }, error => {
                $scope.loading.customers = false
                console.error(error)
            })
    }

    $scope.refreshJobs = function () {
        if ($scope.timesheetEntry.customer == null)
        {
            return;
        }

        $scope.jobs = []
        $scope.tasks = []
        $scope.loading.jobs = true
        $http.get($rootScope.baseUrl + "/odata/Jobs?$orderby=Number&$filter=CustomerId eq " + $scope.timesheetEntry.customer.Id)
            .then(response => {
                $scope.loading.jobs = false
                $scope.jobs = response.data.value
                if (!$scope.timesheetEntry.job) {
                    $scope.timesheetEntry.job = $scope.jobs[0]
                } else {
                    $scope.timesheetEntry.job = $filter('filter')($scope.jobs, { Id: $scope.timesheetEntry.job.Id }, true)[0]
                }
                $scope.refreshTasks()
            }, error => {
                $scope.loading.jobs = false
                console.error(error)
            })
    }

    $scope.refreshTasks = function () {
        if ($scope.timesheetEntry.job == null) {
            return;
        }

        $scope.tasks = []
        $scope.loading.tasks = true
        $http.get($rootScope.baseUrl + "/odata/Tasks?$orderby=Number&$filter=JobId eq " + $scope.timesheetEntry.job.Id)
            .then(response => {
                $scope.loading.tasks = false
                $scope.tasks = response.data.value
                if (!$scope.timesheetEntry.task) {
                    $scope.timesheetEntry.task = $scope.tasks[0]
                } else {
                    $scope.timesheetEntry.task = $filter('filter')($scope.tasks, { Id: $scope.timesheetEntry.task.Id }, true)[0]
                }
            }, error => {
                $scope.loading.tasks = false
                console.error(error)
            })
    }

    $scope.refreshUsers = function () {
        $scope.users = []
        $scope.loading.users = true
        $http.get($rootScope.baseUrl + "/odata/Users?$orderby=Name")
            .then(response => {
                $scope.loading.users = false
                $scope.users = response.data.value
                if (!$scope.timesheetEntry.customer) {
                    $scope.timesheetEntry.user = $scope.users[0]
                } else {
                    $scope.timesheetEntry.user = $filter('filter')($scope.users, { Id: $scope.timesheetEntry.UserId }, true)[0]
                }
            }, error => {
                $scope.loading.users = false
                console.error(error)
            })
    }

    $scope.save = function () {
        if (timesheetEntry.Id == null) {
            $scope.saveNewTimesheetEntry()
        } else {
            $scope.saveExistingTimesheetEntry()
        }
    }

    $scope.saveExistingTimesheetEntry = function () {
        var timedifference = new Date().getTimezoneOffset()
        var json = {
            EnteredAt: moment($scope.timesheetEntry.EnteredAt).subtract(timedifference, 'm').toDate(),
            Minutes: $scope.timesheetEntry.Minutes,
            Notes: $scope.timesheetEntry.Notes,
            TaskId: $scope.timesheetEntry.task.Id,
            UserId: $scope.timesheetEntry.user.Id
        }

        if (confirm("Are you sure you want to modify this entry?")) {
            $http.patch($rootScope.baseUrl + "/odata/TimesheetEntries(" + $scope.timesheetEntry.Id + ")", JSON.stringify(json))
                .then(response => {
                    $scope.ok(false)
                }, error => {
                    console.error(error)
                })
        }
    }

    $scope.saveNewTimesheetEntry = function () {
        var timedifference = new Date().getTimezoneOffset()
        var json = {
            EnteredAt: moment($scope.timesheetEntry.EnteredAt).subtract(timedifference, 'm').toDate(),
            Minutes: $scope.timesheetEntry.Minutes,
            Notes: $scope.timesheetEntry.Notes,
            TaskId: $scope.timesheetEntry.task.Id,
            UserId: $scope.timesheetEntry.user.Id
        }

        $http.post($rootScope.baseUrl + "/odata/TimesheetEntries", JSON.stringify(json))
            .then(response => {
                $scope.ok(false)
            }, error => {
                console.error(error)
            })
    }
    
    $scope.showEnteredAtDatepicker = function () {
        $scope.datepicker.EnteredAt.opened = true
    }

    $scope.ok = function (deleted) {
        $uibModalInstance.close(deleted);
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }

    $scope.refreshCustomers()
    $scope.refreshUsers()
});
