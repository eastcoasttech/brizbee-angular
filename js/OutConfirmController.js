app.controller('OutConfirmController', function ($http, $location, $rootScope, $scope, $window) {
    $scope.options = {
        Country: $rootScope.current.user.Organization.Country,
        OutAtTimeZone: $rootScope.current.user.TimeZone
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
        // var ua = detect.parse(navigator.userAgent)
        var json = {
            SourceForOutAt: 'Web',
            OutAtTimeZone: $scope.options.OutAtTimeZone,
            LatitudeForOutAt: latitude,
            LongitudeForOutAt: longitude,
            SourceHardware: 'Web',
            SourceHostname: 'Unknown',
            // SourceOperatingSystem: ua.os.family,
            // SourceOperatingSystemVersion: ua.os.version,
            // SourceBrowser: ua.browser.family,
            // SourceBrowserVersion: ua.browser.version
            SourceOperatingSystem: '',
            SourceOperatingSystemVersion: '',
            SourceBrowser: '',
            SourceBrowserVersion: ''
        }
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
    }

    // Scroll to top
    $window.scrollTo(0, 0)
});
