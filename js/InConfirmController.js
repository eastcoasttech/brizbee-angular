app.controller('InConfirmController', function ($http, $location, $rootScope, $scope, $window) {
    $scope.options = {
        Country: $rootScope.current.user.Organization.Country,
        InAtTimeZone: $rootScope.current.user.TimeZone
    }
    $scope.show = { timezone: false }
    $scope.working = {}

    $scope.save = function () {
        $scope.working.save = true

        // Attempt to get the user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                latitude = position.coords.latitude
                longitude = position.coords.longitude
                console.log(latitude)
                console.log(longitude)
                saveWithLocation(latitude, longitude)
            });
        } else {
            saveWithLocation(null, null)
        }
    }

    function saveWithLocation(latitude, longitude) {
        var json = {
            InAtTimeZone: $scope.options.InAtTimeZone,
            LatitudeForInAt: latitude,
            LongitudeForInAt: longitude,
            SourceForInAt: 'Web',
            TaskId: $rootScope.selected.task.Id
        }
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
    }

    // Scroll to top
    $window.scrollTo(0, 0)
})
