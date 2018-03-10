app.controller('StatusController', function ($http, $rootScope, $scope, $window) {
    $scope.working = { status: true }

    $scope.refreshStatus = function () {
        $scope.working.status = true

        $http.get($rootScope.baseUrl + "odata/Punches/Default.Current?$expand=Task($expand=Job($expand=Customer))")
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

    $scope.refreshStatus();

    // Scroll to top
    $window.scrollTo(0, 0)
});
