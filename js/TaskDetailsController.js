app.controller('TaskDetailsController', function ($http, $rootScope, $scope, $uibModalInstance, $window, task) {
    if (task.Id == null) {
        $scope.task = {}
    } else {
        $scope.task = task
    }
    $scope.working = { save: false }
    
    $scope.delete = function () {
        if (confirm("Are you sure you want to delete this task?")) {
            $http.delete($rootScope.baseUrl + "odata/Tasks(" + $scope.task.Id + ")")
                .then(response => {
                    $scope.ok()
                }, error => {
                    console.error(error)
                })
        }
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
            Name: $scope.task.Name
        }

        $http.put($rootScope.baseUrl + "odata/Tasks(" + $scope.task.Id + ")", JSON.stringify(json))
            .then(response => {
                $scope.ok()
            }, error => {
                console.error(error)
            })
    }

    $scope.saveNewTask = function () {
        var json = {
            JobId: $rootScope.selected.job.Id,
            Name: $scope.task.Name
        }

        $http.post($rootScope.baseUrl + "odata/Tasks", JSON.stringify(json))
            .then(response => {
                $scope.ok()
            }, error => {
                console.error(error)
            })
    }
    
    $scope.ok = function () {
        $uibModalInstance.close('Success');
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }
});
