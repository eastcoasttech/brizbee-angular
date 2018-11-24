app.controller('TaskDetailsController', function ($http, $rootScope, $scope, $uibModalInstance, $window, job, task) {
    if (task.Id == null) {
        $scope.task = {}
    } else {
        $scope.task = task
    }
    $scope.working = { save: false }
    
    $scope.delete = function () {
        if (confirm("Are you sure you want to delete this task?")) {
            $http.delete($rootScope.baseUrl + "/odata/Tasks(" + $scope.task.Id + ")")
                .then(response => {
                    $scope.ok(true)
                }, error => {
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

    $scope.save = function () {
        if (task.Id == null) {
            $scope.saveNewTask()
        } else {
            $scope.saveExistingTask()
        }
    }

    $scope.saveExistingTask = function () {
        var json = {
            Name: $scope.task.Name,
            Number: $scope.task.Number,
            QuickBooksPayrollItem: $scope.task.QuickBooksPayrollItem,
            QuickBooksServiceItem: $scope.task.QuickBooksServiceItem
        }

        $http.patch($rootScope.baseUrl + "/odata/Tasks(" + $scope.task.Id + ")", JSON.stringify(json))
            .then(response => {
                $scope.ok(false)
            }, error => {
                console.error(error)
            })
    }

    $scope.saveNewTask = function () {
        var json = {
            JobId: job.Id,
            Name: $scope.task.Name,
            Number: $scope.task.Number,
            QuickBooksPayrollItem: $scope.task.QuickBooksPayrollItem,
            QuickBooksServiceItem: $scope.task.QuickBooksServiceItem
        }

        $http.post($rootScope.baseUrl + "/odata/Tasks", JSON.stringify(json))
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

    if (task.Id == null) {
        $scope.nextNumber()
    }
});
