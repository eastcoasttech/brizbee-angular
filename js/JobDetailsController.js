app.controller('JobDetailsController', function ($http, $rootScope, $scope, $uibModalInstance, $window, customer, job) {
    $scope.loading = { templates: false }
    if (job.Id == null) {
        $scope.job = { }
    } else {
        $scope.job = angular.copy(job)
    }
    $scope.templates = []
    $scope.working = { save: false }
    
    $scope.delete = function () {
        $scope.working.save = true

        if (confirm("Are you sure you want to delete this job and all it's tasks?")) {
            $http.delete($rootScope.baseUrl + "/odata/Jobs(" + $scope.job.Id + ")")
                .then(response => {
                    $scope.ok(true)
                }, error => {
                    $scope.working.save = false
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
        $scope.working.save = true

        var json = {
            Description: $scope.job.Description,
            Name: $scope.job.Name,
            Number: $scope.job.Number,
            QuickBooksCustomerJob: $scope.job.QuickBooksCustomerJob
        }

        $http.patch($rootScope.baseUrl + "/odata/Jobs(" + $scope.job.Id + ")", JSON.stringify(json))
            .then(response => {
                $scope.ok(false)
            }, error => {
                $scope.working.save = false
                console.error(error)
            })
    }

    $scope.saveNewJob = function () {
        $scope.working.save = true
        
        var json = {
            CustomerId: customer.Id,
            Description: $scope.job.Description,
            Name: $scope.job.Name,
            Number: $scope.job.Number,
            QuickBooksCustomerJob: $scope.job.QuickBooksCustomerJob
        }

        $http.post($rootScope.baseUrl + "/odata/Jobs", JSON.stringify(json))
            .then(response => {
                $scope.ok(false)
            }, error => {
                $scope.working.save = false
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
        $http.get($rootScope.baseUrl + "/odata/TaskTemplates?$orderby=Name")
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
