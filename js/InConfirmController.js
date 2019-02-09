app.controller('InConfirmController', function ($http, $location, $rootScope, $scope, $window) {
    $scope.options = {
        Country: $rootScope.current.user.Organization.Country,
        OutAtTimeZone: $rootScope.current.user.TimeZone
    }
    $scope.show = { timezone: false }
    $scope.working = {}

    $scope.save = function () {
        $scope.working.save = true

        var json = { TaskId: $rootScope.selected.task.Id, SourceForInAt: 'Web', InAtTimeZone: $scope.options.OutAtTimeZone }
        $http.post($rootScope.baseUrl + "/odata/Punches/Default.PunchIn", JSON.stringify(json))
            .then(response => {
                if (response.data != null)
                {
                    $location.path('/in/done')
                }
            }, error => {
                $scope.working.save = false
                console.error(error)
            })
    };

    // Scroll to top
    $window.scrollTo(0, 0)
});
