app.controller('InJobController', function ($http, $location, $rootScope, $scope, $window) {
    $scope.job = {}
    $scope.working = {}

    $scope.searchJobs = function () {
        $scope.working.search = true
        $http.get($rootScope.baseUrl + "odata/Jobs(" + $scope.job.Id + ")")
            .then(response => {
                $rootScope.selected.job = response
                $scope.$apply()
                $location.path('/in/task')
            }, error => {
                $scope.working.search = false
                console.error(error)
            })
    };

    // Focus on job number input and scroll to top
    $window.document.getElementById("job_id").focus()
    $window.scrollTo(0, 0)
});
