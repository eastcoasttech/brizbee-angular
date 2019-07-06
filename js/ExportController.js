app.controller('ExportController', function ($http, $location, $rootScope, $routeParams, $scope, $window) {

    $scope.errorMessage = $routeParams.errorMessage
    $scope.stateMessage = $routeParams.stateMessage
    $scope.realmId = $routeParams.realmId

    // Scroll to top
    $window.scrollTo(0, 0)
})
