app.controller('UsersController', function ($rootScope, $scope, $uibModal, $window) {
    $scope.loading = { users: false }
    $scope.users = []

    $scope.refreshUsers = function () {
        $scope.users = []
        $scope.loading.users = true
        db.collection('users').find().sort({ email: 1 }).execute()
            .then(docs => {
                $scope.loading.users = false
                $scope.users = docs
                $scope.$apply()
            }).catch(err => {
                $scope.loading.users = false
                console.error(err)
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
                console.log(msg)
                $scope.refreshUsers()
            }, () => {
                console.log('dismissed')
            })
    }
    
    $scope.refreshUsers()

    // Scroll to top
    $window.scrollTo(0, 0)
});
