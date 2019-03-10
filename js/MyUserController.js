app.controller('MyUserController', function ($http, $location, $rootScope, $scope, $window) {
    $scope.messages = { saved: '' }
    $scope.show = { changePassword: false }
    $scope.working = { save: false }

    $rootScope.$watch('current', function (newValue, oldValue, scope) {
        if ("user" in newValue) {
            $scope.user = angular.copy(newValue.user)
        }
    })

    $scope.save = function () {
        $scope.working.save = true

        var json = {
            Name: $scope.user.Name,
            TimeZone: $scope.user.TimeZone
        }

        // Only change the Pin if necessary
        if ($scope.user.Pin != $rootScope.current.user.Pin) {
            json.Pin = $scope.user.Pin
        }

        // Changing password is optional
        if ($scope.show.changePassword) {
            json.Password = $scope.user.Password
        }

        $http.patch($rootScope.baseUrl + "/odata/Users(" + $scope.user.Id + ")", JSON.stringify(json))
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

    // Allow numbers only
    $("input.form-control-number").numeric()
});
