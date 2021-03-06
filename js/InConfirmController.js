app.controller('InConfirmController', function ($http, $location, $rootScope, $scope, $window) {
    $scope.options = {
        Country: $rootScope.current.user.Organization.Country,
        InAtTimeZone: $rootScope.current.user.TimeZone
    }
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
                    maximumAge: 15000, // 15 seconds
                    timeout: 30000, // 30 seconds
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
        // Platform detection
        var browserName = platform.name; // 'Safari'
        var browserVersion = platform.version; // '5.1'
        var operatingSystem = platform.os.family; // 'iOS'
        var operatingSystemVersion = platform.os.version + (platform.os.architecture == 64 ? ' 64-bit' : ''); // 5.0

        var json = {
            InAtTimeZone: $scope.options.InAtTimeZone,
            LatitudeForInAt: latitude,
            LongitudeForInAt: longitude,
            TaskId: $rootScope.selected.task.Id,
            SourceHardware: 'Web',
            SourceOperatingSystem: operatingSystem,
            SourceOperatingSystemVersion: operatingSystemVersion,
            SourceBrowser: browserName,
            SourceBrowserVersion: browserVersion
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
