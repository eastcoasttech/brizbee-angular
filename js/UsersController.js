app.controller('UsersController', function ($rootScope, $scope, $uibModal, $window) {
    $scope.loading = { users: false }
    $scope.users = []

    $scope.refreshUsers = function () {
        $scope.users = []
        $scope.loading.users = true
        $http.get($rootScope.baseUrl + "odata/Users?$orderby=EmailAddress")
            .then(response => {
                $scope.loading.users = false
                $scope.users = response.data.value
            }, error => {
                $scope.loading.users = false
                console.error(error)
            })
    }

    $scope.showEditUser = function (user) {
        var instance = $uibModal.open({
            templateUrl: '/pages/details/user.html',
            controller: 'UserDetailsController',
            resolve: {
                user: function () {
                    return user;
                }
            }
        });

        instance.result
            .then((msg) => {
                $scope.refreshUsers()
            }, () => {
                console.log('dismissed')
            })
    }
    
    $scope.refreshUsers()

    // Scroll to top
    $window.scrollTo(0, 0)
});
