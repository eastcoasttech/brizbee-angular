app.controller('TaskDetailsController', function ($rootScope, $scope, $uibModalInstance, $window, task) {
    if (task._id == null) {
        $scope.task = {}
    } else {
        $scope.task = task
    }
    $scope.working = { save: false }
    
    $scope.save = function () {
        if (task._id == null) {
            $scope.saveNewTask()
        } else {
            $scope.saveExistingTask()
        }
    }

    $scope.saveExistingTask = function () {
        var task = {
            name: $scope.task.name,
            number: $scope.task.number
        }

        db.collection('tasks').updateOne({ _id: $scope.task._id }, { $set: task })
            .then(result => {
                $scope.ok()
            })
            .catch(error => {
                console.error(error)
            })
    }

    $scope.saveNewTask = function () {
        var task = {
            owner_id: client.authedId(),
            organization_id: $rootScope.current.user.organization_id,
            name: $scope.task.name,
            number: $scope.task.number,
            created_at: new Date()
        }

        db.collection('tasks').insertOne(task)
            .then(result => {
                $scope.ok()
            })
            .catch(error => {
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
