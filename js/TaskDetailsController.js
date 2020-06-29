app.controller('TaskDetailsController', function ($filter, $http, $rootScope, $scope, $uibModalInstance, $window, job, task) {
    if (task.Id == null) {
        $scope.task = { }
    } else {
        $scope.task = angular.copy(task)
    }
    $scope.working = { save: false }
    
    $scope.delete = function () {
        $scope.working.save = true
        
        if (confirm("Are you sure you want to delete this task?")) {
            $http.delete($rootScope.baseUrl + "/odata/Tasks(" + $scope.task.Id + ")")
                .then(response => {
                    $scope.ok(true)
                }, error => {
                    $scope.working.save = false
                    console.error(error)
                })
        }
    }

    $scope.nextNumber = function () {
        $http.post($rootScope.baseUrl + '/odata/Tasks/Default.NextNumber')
            .then(response => {
                $scope.task.Number = response.data.value
            }, error => {
                console.error(error)
            })
    }
    
    $scope.refreshPayrollRates = function () {
        $scope.basePayrollRates = []

        // Filter by type
        $http.get($rootScope.baseUrl + "/odata/Rates?$orderby=Name&$filter=ParentRateId eq null and Type eq 'Payroll'")
            .then(response => {
                $scope.basePayrollRates = response.data.value
                $scope.basePayrollRates.splice(0, 0, { Name: 'None', Id: null })

                if (!$scope.task.BasePayrollRateId) {
                    $scope.task.BasePayrollRate = $scope.basePayrollRates[0] // Select first rate
                } else {
                    $scope.task.BasePayrollRate = $filter('filter')($scope.basePayrollRates, { Id: $scope.task.BasePayrollRateId }, true)[0]
                }
            }, error => {
                console.error(error)
            })
    }
    
    $scope.refreshServiceRates = function () {
        $scope.baseServiceRates = []

        // Filter by type
        $http.get($rootScope.baseUrl + "/odata/Rates?$orderby=Name&$filter=ParentRateId eq null and Type eq 'Service'")
            .then(response => {
                $scope.baseServiceRates = response.data.value
                $scope.baseServiceRates.splice(0, 0, { Name: 'None', Id: null })

                if (!$scope.task.BaseServiceRateId) {
                    $scope.task.BaseServiceRate = $scope.baseServiceRates[0] // Select first rate
                } else {
                    $scope.task.BaseServiceRate = $filter('filter')($scope.baseServiceRates, { Id: $scope.task.BaseServiceRateId }, true)[0]
                }
            }, error => {
                console.error(error)
            })
    }

    $scope.save = function () {
        if (task.Id == null) {
            $scope.saveNewTask()
        } else {
            $scope.saveExistingTask()
        }
    }

    $scope.saveExistingTask = function () {
        $scope.working.save = true

        var json = {
            Name: $scope.task.Name,
            Number: $scope.task.Number,
            BasePayrollRateId: $scope.task.BasePayrollRate.Id,
            BaseServiceRateId: $scope.task.BaseServiceRate.Id
        }

        $http.patch($rootScope.baseUrl + "/odata/Tasks(" + $scope.task.Id + ")", JSON.stringify(json))
            .then(response => {
                $scope.ok(false)
            }, error => {
                $scope.working.save = false
                console.error(error)
            })
    }

    $scope.saveNewTask = function () {
        $scope.working.save = true

        var json = {
            JobId: job.Id,
            Name: $scope.task.Name,
            Number: $scope.task.Number,
            BasePayrollRateId: $scope.task.BasePayrollRate.Id,
            BaseServiceRateId: $scope.task.BaseServiceRate.Id
        }

        $http.post($rootScope.baseUrl + "/odata/Tasks", JSON.stringify(json))
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

    if (task.Id == null) {
        $scope.nextNumber()
    }

    $scope.refreshPayrollRates()
    $scope.refreshServiceRates()
});
