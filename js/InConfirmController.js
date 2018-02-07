app.controller('InConfirmController', function ($http, $location, $rootScope, $scope, $window) {
    $scope.working = {}

    $scope.save = function () {
        $scope.working.save = true
        
        var json = { TaskId: $rootScope.selected.task.Id }
        console.log(json)
        $http.post($rootScope.baseUrl + "odata/Punches/Default.PunchIn", JSON.stringify(json))
            .then(response => {
                if (response.data != null)
                {
                    $scope.logout()
                }
            }, error => {
                console.error(error)
            })
    };

    // Scroll to top
    $window.scrollTo(0, 0)
});
