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
            navigator.geolocation.getCurrentPosition(
                currentPositionSuccess,
                currentPositionFail,
                // maximumAge refers to the age of the location data in cache,
                // setting it to infinity guarantees you'll get a cached version.
                // Setting it to 0 forces the device to retrieve the position.
                // http://stackoverflow.com/questions/3397585/navigator-geolocation-getcurrentposition-sometimes-works-sometimes-doesnt
                {
                    maximumAge: 15000,
                    timeout: 30000,
                    enableHighAccuracy: false
                }
            );
        } else {
            save(null, null)
        }
    }

    function currentPositionSuccess(position) {
        latitude = position.coords.latitude.toString()
        longitude = position.coords.longitude.toString()
        save(latitude, longitude)
    }

    function currentPositionFail(error) {
        switch (error.code) {
            case 0:
                // UNKNOWN_ERROR
                break;
            case 1:
                // PERMISSION_DENIED
                break;
            case 2:
                // POSITION_UNAVAILABLE
                break;
            case 3:
                // TIMEOUT
                break;
        }
        save(null, null)
    }

    function save(latitude, longitude) {
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
