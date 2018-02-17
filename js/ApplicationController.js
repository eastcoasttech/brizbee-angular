app.controller('ApplicationController', function ($location, $rootScope, $scope) {
    $rootScope.baseUrl = "http://localhost:54313/"
    // $rootScope.baseUrl = "https://brizbeeweb.azurewebsites.net/"
    $rootScope.selected = {}
    $rootScope.current = {}
    $rootScope.range = { in_at: moment().startOf('day').toDate(), out_at: moment().endOf('day').toDate() }

    $scope.logout = function () {
        $rootScope.current = {}
        $location.path('/')
    };

    $scope.showMomentDate = function (date, format) {
        return moment(date).format(format)
    };

    // $scope.refreshUser = function () {
    //     if ($rootScope.current != null) {
    //         client.userProfile()
    //             .then(userData => {
    //                 // Determine if user exists, redirect as appropriate
    //                 db.collection('users').find({ _id: client.authedId() }).execute()
    //                     .then((users) => {
    //                         if (users.length > 0) {
    //                             // User exists, redirect to status
    //                             $rootScope.current.user = users[0]
    //                             $scope.$apply()
    //                         }
    //                     })
    //                     .catch((error) => {
    //                         console.error(error)
    //                     })
    //             })
    //     }
    // };

    // $scope.refreshUser()
});
