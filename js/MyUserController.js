app.controller('MyUserController', function ($http, $location, $rootScope, $scope, $window) {
    $scope.messages = { saved: '' }
    $scope.show = { changePassword: false }
    $scope.user = angular.copy($rootScope.current.user)
    $scope.working = { save: false }

    $scope.save = function () {
        $scope.working.save = true

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
                $scope.messages.saved = 'Changes were saved!'
                $rootScope.current.user.Name = $scope.user.Name
                $rootScope.current.user.Pin = $scope.user.Pin
                $scope.working.save = false
            }, error => {
                $scope.working.save = false
                console.error(error)
            })
    }

    // Scroll to top
    $window.scrollTo(0, 0)
});
