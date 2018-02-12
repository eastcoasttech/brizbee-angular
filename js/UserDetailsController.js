app.controller('UserDetailsController', function ($rootScope, $scope, $uibModalInstance, user) {
    $scope.user = user
    $scope.working = { save: false }
    
    $scope.save = function () {
        $scope.saveExistingUser()
    }

    $scope.saveExistingUser = function () {
        var json = {
            name: $scope.user.name,
            role: $scope.user.role
        }

        $http.put($rootScope.baseUrl + "odata/Users(" + $scope.user.Id + ")", JSON.stringify(json))
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
