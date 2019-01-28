app.controller('OutConfirmController', function ($http, $location, $rootScope, $scope, $window) {
    $scope.working = {}

    $scope.save = function () {
        $scope.working.save = true
        
        var timezone = $rootScope.current.user.TimeZone
        
        var json = { SourceForOutAt: 'Web', OutAtTimeZone: timezone }
        $http.post($rootScope.baseUrl + "/odata/Punches/Default.PunchOut", JSON.stringify(json))
            .then(response => {
                if (response.data != null)
                {
                    $location.path('/out/done')
                }
            }, error => {
                $scope.working.save = false
                console.error(error)
            })
    };

    // Scroll to top
    $window.scrollTo(0, 0)
});
