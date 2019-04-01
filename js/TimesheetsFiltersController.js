app.controller('TimesheetsFiltersController', function ($http, $rootScope, $scope, $uibModalInstance, user) {
    $scope.loading = { users: false }
    $scope.selected = { user: user.Id }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel')
    }

    $scope.ok = function () {
        var matched = _.findLast($scope.users, function(u) {
            return u.Id == $scope.selected.user;
        });
        $uibModalInstance.close(matched)
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
