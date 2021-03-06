app.controller('UserDetailsController', function ($http, $rootScope, $scope, $uibModalInstance, user) {
    $scope.show = { changePassword: false }
    if (user.Id == null) {
        $scope.show.changePassword = true
        $scope.user = { Role: "Standard" }
    } else {
        $scope.user = angular.copy(user)
    }
    $scope.working = { save: false }
    
    $scope.delete = function () {
        if (confirm("Are you sure you want to delete this user?")) {
            $http.delete($rootScope.baseUrl + "/odata/Users(" + $scope.user.Id + ")")
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
            QuickBooksEmployee: $scope.user.QuickBooksEmployee,
            TimeZone: $scope.user.TimeZone,
            UsesTimesheets: $scope.user.UsesTimesheets,
            UsesMobileClock: $scope.user.UsesMobileClock,
            UsesTouchToneClock: $scope.user.UsesTouchToneClock,
            UsesWebClock: $scope.user.UsesWebClock,
            AllowedPhoneNumbers: $scope.user.AllowedPhoneNumbers
        }

        // Only change the Pin if necessary
        if ($scope.user.Pin != user.Pin) {
            json.Pin = $scope.user.Pin
        }

        // Changing password is optional
        if ($scope.show.changePassword) {
            json.Password = $scope.user.Password
        }

        $http.patch($rootScope.baseUrl + "/odata/Users(" + $scope.user.Id + ")", JSON.stringify(json))
            .then(response => {
                $scope.ok()
            }, error => {
                console.error(error)
            })
    }

    $scope.saveNewUser = function () {
        var json = {
            Name: $scope.user.Name,
            Role: $scope.user.Role,
            Pin: $scope.user.Pin,
            Password: $scope.user.Password,
            QuickBooksEmployee: $scope.user.QuickBooksEmployee,
            TimeZone: $scope.user.TimeZone,
            UsesTimesheets: $scope.user.UsesTimesheets,
            UsesMobileClock: $scope.user.UsesMobileClock,
            UsesTouchToneClock: $scope.user.UsesTouchToneClock,
            UsesWebClock: $scope.user.UsesWebClock,
            AllowedPhoneNumbers: $scope.user.AllowedPhoneNumbers
        }

        if ($scope.user.EmailAddress != '') {
            json.EmailAddress = $scope.user.EmailAddress
        }

        $http.post($rootScope.baseUrl + "/odata/Users", JSON.stringify(json))
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
