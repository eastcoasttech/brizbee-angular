app.controller('StatusController', function ($http, $rootScope, $scope, $window) {
    $scope.refreshStatus = function () {
        $http.get($rootScope.baseUrl + "odata/Punches/Default.Current")
            .then(response => {
                $rootScope.current.punch = response.data
            }, error => {
                console.error(error)
            })

        // db.collection('punches').find({ user_id: client.authedId(), out_at: { $exists: false } }).sort({ in_at: -1 }).limit(1).execute()
        //     .then(punches => {
        //         if (punches.length > 0) {
        //             $rootScope.current.punch = punches[0]
        //             $rootScope.$apply()
        //         }
        //     }).catch(error => {
        //         console.error(error)
        //     })
    };

    $scope.refreshStatus();

    // Scroll to top
    $window.scrollTo(0, 0)
});
