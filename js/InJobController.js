app.controller('InJobController', function ($location, $rootScope, $scope, $window) {
    $scope.job = {}
    $scope.working = {}

    $scope.searchJobs = function () {
        $scope.working.search = true
        db.collection('jobs').find({ number: $scope.job.number }).limit(1).execute()
            .then(jobs => {
                console.log(jobs)
                if (jobs.length > 0) {
                    $rootScope.selected.job = jobs[0]
                    $location.path('/in/task')
                    $scope.$apply()
                } else {
                    $scope.working.search = false
                    console.error('No job found')
                }
            }).catch(err => {
                $scope.working.search = false
                console.error(err)
            })
    };

    // Focus on job number input and scroll to top
    $window.document.getElementById("job_number").focus()
    $window.scrollTo(0, 0)
});
