app.controller('UsersController', function ($http, $rootScope, $scope, $uibModal, $window) {
    $scope.loading = { punches: false, users: false }
    $scope.punches = []
    $scope.punchesPageStart = 0
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

    $scope.refreshPunches = function () {
        $scope.punches = []
        $scope.loading.punches = true
        $http.get($rootScope.baseUrl + "/odata/Punches?$count=true&$orderby=User/Name&$filter=OutAt eq null&$expand=User,Task($expand=Job($expand=Customer))")
            .then(response => {
                $scope.loading.punches = false
                $scope.punchesCount = response.data["@odata.count"]
                $scope.punches = response.data.value
            }, error => {
                $scope.loading.punches = false
                console.error(error)
            })
    }

    $scope.punchesEnd = function () {
        return $scope.punchesPageStart + 20 < $scope.punchesCount ? $scope.punchesPageStart + 20 : $scope.punchesCount;
    };

    $scope.punchesNext = function () {
        $scope.punchesPageStart = $scope.punchesPageStart + 20
        $scope.refreshPunches()
    }
    
    $scope.punchesPrevious = function () {
        $scope.punchesPageStart = $scope.punchesPageStart - 20
        $scope.refreshPunches()
    }

    $scope.punchesStart = function () {
        return $scope.punchesPageStart + 1
    }

    $scope.refreshUsers()
    $scope.refreshPunches()

    // Scroll to top
    $window.scrollTo(0, 0)
});
