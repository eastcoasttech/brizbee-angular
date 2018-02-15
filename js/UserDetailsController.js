app.controller('UserDetailsController', function ($http, $rootScope, $scope, $uibModalInstance, user) {
    if (user.Id == null) {
        $scope.user = { Role: "Standard" }
    } else {
        $scope.user = user
    }
    $scope.working = { save: false }
    
    $scope.delete = function () {
        if (confirm("Are you sure you want to delete this user?")) {
            $http.delete($rootScope.baseUrl + "odata/Users(" + $scope.user.Id + ")")
                .then(response => {
                    $scope.ok(true)
                }, error => {
                    console.error(error)
                })
        }
    }

    $scope.save = function () {
        if (user.Id == null) {
            $scope.saveNewUser()
        } else {
            $scope.saveExistingUser()
        }
    }

    $scope.saveExistingUser = function () {
        var json = {
            Name: $scope.user.Name,
            Role: $scope.user.Role,
            Pin: $scope.user.Pin
        }

        $http.patch($rootScope.baseUrl + "odata/Users(" + $scope.user.Id + ")", JSON.stringify(json))
            .then(response => {
                $scope.ok()
            }, error => {
                console.error(error)
            })
    }

    $scope.saveNewUser = function () {
        var json = {
            EmailAddress: $scope.user.EmailAddress,
            Name: $scope.user.Name,
            Role: $scope.user.Role,
            Pin: $scope.user.Pin,
            Password: $scope.user.Password
        }

        $http.post($rootScope.baseUrl + "odata/Users", JSON.stringify(json))
            .then(response => {
                $scope.ok(false)
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
