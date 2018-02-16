app.controller('MyOrganizationController', function ($http, $location, $rootScope, $scope, $window) {
    $scope.organization = angular.copy($rootScope.current.user.Organization)
    $scope.working = { save: false }

    $scope.save = function () {
        $scope.working = true

        var json = {
            Name: $scope.organization.Name,
            Code: $scope.organization.Code
        }

        $http.patch($rootScope.baseUrl + "odata/Organizations(" + $scope.organization.Id + ")", JSON.stringify(json))
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
