app.controller('JobDetailsController', function ($http, $rootScope, $scope, $uibModalInstance, $window, customer, job) {
    $scope.loading = { templates: false }
    if (job.Id == null) {
        $scope.job = {}
    } else {
        $scope.job = job
    }
    $scope.templates = []
    $scope.working = { save: false }
    
    $scope.delete = function () {
        if (confirm("Are you sure you want to delete this job and all it's tasks?")) {
            $http.delete($rootScope.baseUrl + "odata/Jobs(" + $scope.job.Id + ")")
                .then(response => {
                    $scope.ok(true)
                }, error => {
                    console.error(error)
                })
        }
    }
    
    $scope.nextNumber = function () {
        $http.post($rootScope.baseUrl + '/odata/Jobs/Default.NextNumber')
            .then(response => {
                $scope.job.Number = response.data.value
            }, error => {
                console.error(error)
            })
    }

    $scope.save = function () {
        if (job.Id == null) {
            $scope.saveNewJob()
        } else {
            $scope.saveExistingJob()
        }
    }

    $scope.saveExistingJob = function () {
        var json = {
            Name: $scope.job.Name,
            Number: $scope.job.Number,
            QuickBooksCustomerJob: $scope.job.QuickBooksCustomerJob
        }

        $http.patch($rootScope.baseUrl + "odata/Jobs(" + $scope.job.Id + ")", JSON.stringify(json))
            .then(response => {
                $scope.ok(false)
            }, error => {
                console.error(error)
            })
    }

    $scope.saveNewJob = function () {
        var json = {
            CustomerId: customer.Id,
            Name: $scope.job.Name,
            Number: $scope.job.Number,
            QuickBooksCustomerJob: $scope.job.QuickBooksCustomerJob
        }

        $http.post($rootScope.baseUrl + "odata/Jobs", JSON.stringify(json))
            .then(response => {
                $scope.ok(false)
            }, error => {
                console.error(error)
            })
    }
    
    $scope.ok = function (deleted) {
        $uibModalInstance.close(deleted);
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }

    $scope.refreshTemplates = function () {
        if (!$scope.job.Id) {
            return;
        }

        $scope.templates = []
        $scope.loading.templates = true
        $http.get($rootScope.baseUrl + "odata/TaskTemplates?$orderby=Name")
            .then(response => {
                $scope.loading.templates = false
                $scope.templates = response.data.value
            }, error => {
                $scope.loading.templates = false
                console.error(error)
            })
    }

    if (job.Id == null) {
        $scope.nextNumber()
    }

    $scope.refreshTemplates()
});
