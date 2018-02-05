app.controller('UserDetailsController', function ($rootScope, $scope, $uibModalInstance, user) {
    $scope.user = user
    $scope.working = { save: false }
    
    $scope.save = function () {
        $scope.saveExistingUser()
    }

    $scope.saveExistingUser = function () {
        var user = {
            name: $scope.user.name,
            role: $scope.user.role
        }

        db.collection('users').updateOne({ _id: $scope.user._id }, { $set: user })
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
