app.controller('StatusController', function ($http, $rootScope, $scope, $window) {
    $scope.refreshStatus = function () {
        $http.get($rootScope.baseUrl + "odata/Punches/Default.Current?$expand=Task/Job/Customer")
            .then(response => {
                if (response.data != null)
                {
                    $rootScope.current.punch = response.data
                }
            }, error => {
                console.error(error)
            })
    };

    $scope.refreshStatus();

    // Scroll to top
    $window.scrollTo(0, 0)
});
