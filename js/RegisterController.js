app.controller('RegisterController', function ($http, $location, $rootScope, $routeParams, $scope, $window) {
    $scope.user = {}
    $scope.organization = {}
    $scope.show = { success: false }
    $scope.working = { register: false }

    if ($routeParams.EmailAddress != null) {
        $scope.user.EmailAddress = $routeParams.EmailAddress
    }

    $scope.register = function () {
        $scope.working.register = true

        // Create the user and organization
        var json = {
            Organization: {
                Code: $scope.organization.Code,
                Name: $scope.organization.Name
            },
            User: {
                EmailAddress: $scope.user.EmailAddress,
                Name: $scope.user.Name,
                Password: $scope.user.Password
            }
        }
        $http.post($rootScope.baseUrl + "/odata/Users/Default.Register", json)
            .then(response => {
                $scope.working.register = false
                $scope.show.success = true
            }, error => {
                $scope.working.register = false
                console.error(error)
            })
    }

    // Focus on name input and scroll to top
    $window.document.getElementById("user_email_address").focus()
    $window.scrollTo(0, 0)
})
