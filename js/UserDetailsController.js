app.controller('UserDetailsController', function ($http, $rootScope, $scope, $uibModalInstance, user) {
    $scope.user = user
    $scope.working = { save: false }
    
    $scope.save = function () {
        $scope.saveExistingUser()
    }

    $scope.saveExistingUser = function () {
        var json = {
            Name: $scope.user.Name,
            Role: $scope.user.Role,
            Pin: $scope.user.Pin
        }

        $http.put($rootScope.baseUrl + "odata/Users(" + $scope.user.Id + ")", JSON.stringify(json))
            .then(response => {
                $scope.ok()
            }, error => {
                console.error(error)
            })
    }
    
    $scope.ok = function () {
        $uibModalInstance.close('Success')
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel')
    }
})
