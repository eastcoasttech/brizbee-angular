app.controller('TimesheetsAddController', function ($http, $interval, $location, $rootScope, $scope, $window) {
    $scope.timesheetEntry = {
        EnteredAt: moment().startOf('day').toDate()
    }
    $scope.time = { hours: "0", minutes: "0" }
    
    $scope.datepicker = { EnteredAt: {}, options: {} }
    $scope.loading = { customers: false, jobs: false, tasks: false }
    $scope.show = { notes: false }
    $scope.working = { save: false }

    $scope.refreshCustomers = function () {
        $scope.customers = []
        $scope.loading.customers = true
        $http.get($rootScope.baseUrl + "/odata/Customers?$orderby=Number")
            .then(response => {
                $scope.customers = response.data.value
                if (!$scope.timesheetEntry.customer) {
                    $scope.timesheetEntry.customer = $scope.customers[0]
                } else {
                    $scope.timesheetEntry.customer = $filter('filter')($scope.customers, { Id: $scope.timesheetEntry.customer.Id }, true)[0]
                }
                $scope.loading.customers = false
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
                $scope.jobs = response.data.value
                if (!$scope.timesheetEntry.job) {
                    $scope.timesheetEntry.job = $scope.jobs[0]
                } else {
                    $scope.timesheetEntry.job = $filter('filter')($scope.jobs, { Id: $scope.timesheetEntry.job.Id }, true)[0]
                }
                $scope.loading.jobs = false
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
                $scope.tasks = response.data.value
                if (!$scope.timesheetEntry.task) {
                    $scope.timesheetEntry.task = $scope.tasks[0]
                } else {
                    $scope.timesheetEntry.task = $filter('filter')($scope.tasks, { Id: $scope.timesheetEntry.task.Id }, true)[0]
                }
                $scope.loading.tasks = false
            }, error => {
                $scope.loading.tasks = false
                console.error(error)
            })
    }

    $scope.save = function () {
        $scope.working.save = true

        // Calculate minutes from inputs
        var minutes = parseInt($scope.time.minutes) + (parseInt($scope.time.hours) * 60)

        var timedifference = new Date().getTimezoneOffset()
        var json = {
            EnteredAt: moment($scope.timesheetEntry.EnteredAt).subtract(timedifference, 'm').toDate(),
            Minutes: minutes,
            Notes: $scope.timesheetEntry.Notes,
            TaskId: $scope.timesheetEntry.task.Id,
            UserId: $rootScope.current.user.Id
        }

        $http.post($rootScope.baseUrl + "/odata/TimesheetEntries", JSON.stringify(json))
            .then(response => {
                $location.path('/status')
            }, error => {
                $scope.working.save = false
                console.error(error)
            })
    }
    
    $scope.showEnteredAtDatepicker = function () {
        $scope.datepicker.EnteredAt.opened = true
    }
    
    $scope.refreshCustomers()

    // Scroll to top
    $window.scrollTo(0, 0)
});
