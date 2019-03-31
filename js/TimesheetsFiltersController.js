app.controller('TimesheetsFiltersController', function ($http, $rootScope, $scope, $uibModalInstance, filters) {
    $scope.filters = filters
    $scope.loading = { users: false }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel')
    }

    $scope.ok = function () {
        $uibModalInstance.close($scope.filters)
    }

    $scope.refresh = function () {
        $scope.ok()
    }

    $scope.refreshUsers = function () {
        $scope.users = []
        $scope.loading.users = true
        $http.get($rootScope.baseUrl + "/odata/Users?$orderby=Id")
            .then(response => {
                $scope.loading.users = false
                $scope.users = response.data.value
            }, error => {
                $scope.loading.users = false
                console.error(error)
            })
    }

    $scope.refreshUsers()
});
