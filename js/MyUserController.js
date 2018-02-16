app.controller('MyUserController', function ($http, $location, $rootScope, $scope, $window) {
    $scope.show = { changePassword: false }
    $scope.user = angular.copy($rootScope.current.user)
    $scope.working = { save: false }

    $scope.save = function () {
        $scope.working = true

        var json = {
            Name: $scope.user.Name,
            Pin: $scope.user.Pin
        }

        // Changing password is optional
        if ($scope.show.changePassword) {
            json.Password = $scope.user.Password
        }

        $http.patch($rootScope.baseUrl + "odata/Users(" + $scope.user.Id + ")", JSON.stringify(json))
            .then(response => {
                $scope.working = false
            }, error => {
                $scope.working = false
                console.error(error)
            })
    }

    // Scroll to top
    $window.scrollTo(0, 0)
});
