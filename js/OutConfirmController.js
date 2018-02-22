app.controller('OutConfirmController', function ($http, $location, $rootScope, $scope, $window) {
    $scope.working = {}

    $scope.save = function () {
        $scope.working.save = true
        $http.post($rootScope.baseUrl + "odata/Punches/Default.PunchOut")
            .then(response => {
                if (response.data != null)
                {
                    $scope.logout()
                }
            }, error => {
                $scope.working.save = false
                console.error(error)
            })
    };

    // Scroll to top
    $window.scrollTo(0, 0)
});
