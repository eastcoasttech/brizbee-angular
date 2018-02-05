app.controller('OutConfirmController', function ($location, $rootScope, $scope, $window) {
    $scope.working = {}

    $scope.save = function () {
        $scope.working.save = true

        client.executeFunction("punchOut")
            .then((result) => {
                $scope.logout()
            })

        // // Perform update
        // db.collection('punches').find({ user_id: client.authedId(), out_at: { $exists: false } }, { limit: 1, sort: { in_at: -1 } })
        //     .then(punches => {
        //         if (punches.length > 0) {
        //             db.collection('punches').updateOne({ _id: punches[0]['_id'] }, {
        //                 $set: { out_at: new Date() }
        //             })
        //             .then(result => {
        //                 $scope.logout()
        //             })
        //             .catch(error => {
        //                 console.error(error)
        //             })
        //         }
        //     })
        //     .catch(error => {
        //         console.error(error)
        //     })
    };

    // Scroll to top
    $window.scrollTo(0, 0)
});
