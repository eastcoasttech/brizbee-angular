app.controller('InConfirmController', function ($location, $rootScope, $scope, $window) {
    $scope.working = {}

    $scope.save = function () {
        $scope.working.save = true

        // Check for existing punch
        db.collection('punches').find({ user_id: client.authedId(), out_at: { $exists: false } }, { sort: { in_at: 0 } }).limit(1).execute()
            .then(punches => {
                if (punches.length > 0) {
                    // User is already punched in
                    // punchOutAndIn(punches[0]['_id'])
                    punchOutAndIn()
                }
                else
                {
                    // User is not punched in
                    punchIn()
                }
            }).catch(error => {
                console.error(error)
            })
    };

    function punchIn() {
        client.executeFunction("punchIn", $scope.selected.job, $scope.selected.task)
            .then((result) => {
                $scope.logout()
            })

        // db.collection('punches').insertOne({
        //     owner_id: client.authedId(),
        //     user_id: client.authedId(),
        //     user_name: $rootScope.current.user.name,
        //     organization_id: $rootScope.current.user.organization_id,
        //     customer_id: $scope.selected.job.customer_id,
        //     customer_number: $scope.selected.job.customer_number,
        //     customer_name: $scope.selected.job.customer_name,
        //     job_id: $scope.selected.job._id,
        //     job_number: $scope.selected.job.number,
        //     job_name: $scope.selected.job.name,
        //     task_id: $scope.selected.task._id,
        //     task_number: $scope.selected.task.number,
        //     task_name: $scope.selected.task.name,
        //     in_at: moment().toDate()
        // })
        //     .then(punchIds => {
        //         $location.path('/status')
        //         $scope.$apply()
        //     })
        //     .catch(error => {
        //         console.error(error)
        //     })
    }

    // function punchOutAndIn(punchId) {
    //     db.collection('punches').updateOne({ _id: punchId }, {
    //         $set: { out_at: moment().toDate() }
    //     })
    //         .then(result => {
    //             punchIn()
    //         })
    //         .catch(error => {
    //             console.error(error)
    //         })
    // }

    function punchOutAndIn() {
        client.executeFunction("punchOutAndIn", $scope.selected.job, $scope.selected.task)
            .then((result) => {
                $scope.logout()
            })
    }

    // Scroll to top
    $window.scrollTo(0, 0)
});
