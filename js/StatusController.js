app.controller('StatusController', function ($http, $interval, $rootScope, $scope, $window) {
    $scope.working = { status: true }

    function refreshStatus () {
        delete $rootScope.current.punch;
        $scope.working.status = true

        $http.get($rootScope.baseUrl + "/odata/Punches/Default.Current?$expand=Task($expand=Job($expand=Customer))")
            .then(response => {
                if (response.data != null)
                {
                    $rootScope.current.punch = response.data
                    $scope.working.status = false
                }
            }, error => {
                console.error(error)
                $scope.working.status = false
            })
    };

    // $interval(refreshStatus, 15000)
    refreshStatus()

    // Scroll to top
    $window.scrollTo(0, 0)
});
