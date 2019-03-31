app.controller('PunchesFiltersController', function ($http, $rootScope, $scope, $uibModalInstance, filters) {
    $scope.filters = filters
    $scope.loading = { customers: false, jobs: false, tasks: false }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel')
    }

    $scope.ok = function () {
        $uibModalInstance.close($scope.filters)
    }

    $scope.refreshCustomers = function () {
        $scope.customers = []
        $scope.loading.customers = true
        $http.get($rootScope.baseUrl + "/odata/Customers?$orderby=Id")
            .then(response => {
                $scope.loading.customers = false
                $scope.customers = response.data.value
                $scope.refreshJobs()
            }, error => {
                $scope.loading.customers = false
                console.error(error)
            })
    }

    $scope.refreshJobs = function () {
        if (!$scope.filters['customer'].customer_id) {
            return;
        }

        $scope.jobs = []
        $scope.tasks = []
        $scope.loading.jobs = true
        $http.get($rootScope.baseUrl + "/odata/Jobs?$orderby=Id&$filter=CustomerId eq " + $scope.filters['customer'].customer_id.Id)
            .then(response => {
                $scope.loading.jobs = false
                $scope.jobs = response.data.value
                $scope.refreshTasks()
            }, error => {
                $scope.loading.jobs = false
                console.error(error)
            })
    }

    $scope.refreshTasks = function () {
        if (!$scope.filters['job'].job_id) {
            return;
        }

        $scope.tasks = []
        $scope.loading.tasks = true
        $http.get($rootScope.baseUrl + "/odata/Tasks?$orderby=Id&$filter=JobId eq " + $scope.filters['job'].job_id.Id)
            .then(response => {
                $scope.loading.tasks = false
                $scope.tasks = response.data.value
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
            }, error => {
                $scope.loading.users = false
                console.error(error)
            })
    }

    $scope.refreshUsers()
    $scope.refreshCustomers()
});
