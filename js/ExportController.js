app.controller('ExportController', function ($http, $location, $rootScope, $routeParams, $scope, $window) {

    $scope.errorMessage = $routeParams.errorMessage
    $scope.stateMessage = $routeParams.stateMessage
    $scope.realmId = $routeParams.realmId
    $scope.accessToken = $routeParams.accessToken
    $scope.accessTokenExpiresAt = $routeParams.accessTokenExpiresAt
    $scope.refreshToken = $routeParams.refreshToken
    $scope.refreshTokenExpiresAt = $routeParams.refreshTokenExpiresAt

    $scope.refreshCompanyInformation = function () {
        $http.get("https://brizbee.gowitheast.com/api/QuickBooksOnline/CompanyInformation?realmId=" + $scope.realmId + "&accessToken=" + $scope.accessToken)
            .then(response => {
                console.log(response)
            }, error => {
                console.error(error)
            })
    }

    // Scroll to top
    $window.scrollTo(0, 0)
})
