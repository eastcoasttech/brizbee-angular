app.controller('UsersController', function ($http, $rootScope, $scope, $uibModal, $window) {
    $scope.loading = { users: false }
    $scope.users = []
    $scope.usersPageStart = 0

    $scope.refreshUsers = function () {
        $scope.users = []
        $scope.loading.users = true
        $http.get($rootScope.baseUrl + "/odata/Users?$count=true&$orderby=EmailAddress")
            .then(response => {
                $scope.loading.users = false
                $scope.usersCount = response.data["@odata.count"]
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
        })

        instance.rendered
            .then(() => {
                // Allow numbers only
                $("input.form-control-number").numeric()
            })

        instance.result
            .then((msg) => {
                $scope.refreshUsers()
            }, () => {
                console.log('dismissed')
            })
    }

    $scope.showNewUser = function () {
        var instance = $uibModal.open({
            templateUrl: '/pages/details/user.html',
            controller: 'UserDetailsController',
            resolve: {
                user: function () {
                    return {};
                }
            }
        })

        instance.rendered
            .then(() => {
                // Allow numbers only
                $("input.form-control-number").numeric()
            })

        instance.result
            .then((msg) => {
                console.log(msg)
                $scope.refreshUsers()
            }, () => {
                console.log('dismissed')
            })
    }

    $scope.usersEnd = function () {
        return $scope.usersPageStart + 20 < $scope.usersCount ? $scope.usersPageStart + 20 : $scope.usersCount;
    };

    $scope.usersNext = function () {
        $scope.usersPageStart = $scope.usersPageStart + 20
        $scope.refreshUsers()
    }
    
    $scope.usersPrevious = function () {
        $scope.usersPageStart = $scope.usersPageStart - 20
        $scope.refreshUsers()
    }

    $scope.usersStart = function () {
        return $scope.usersPageStart + 1
    }
    
    $scope.refreshUsers()

    // Scroll to top
    $window.scrollTo(0, 0)
});
