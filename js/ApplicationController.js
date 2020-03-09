app.controller('ApplicationController', function ($cookies, $http, $location, $rootScope, $scope) {
    $rootScope.baseUrl = "https://brizbee.gowitheast.com"
    // $rootScope.baseUrl = "http://localhost:54313"
    $rootScope.selected = {}
    $rootScope.current = {}
    $rootScope.range = {
        InAt: moment().day(1).startOf('day').toDate(),
        OutAt: moment().day(7).endOf('day').toDate()
    }
    
    $http.get($rootScope.baseUrl + "/odata/Organizations/Default.Countries")
        .then(response => {
            $rootScope.countries = response.data.value;
        })

    $http.get($rootScope.baseUrl + "/odata/Organizations/Default.Timezones")
        .then(response => {
            $rootScope.timezones = response.data.value;
        })

    if (($cookies.get("BRIZBEE_AUTH_USER_ID") != null) &&
        ($cookies.get("BRIZBEE_AUTH_USER_ID") != "null"))
    {
        $http.defaults.headers.common = {
            'AUTH_USER_ID': $cookies.get('BRIZBEE_AUTH_USER_ID'),
            'AUTH_EXPIRATION': $cookies.get('BRIZBEE_AUTH_EXPIRATION'),
            'AUTH_TOKEN': $cookies.get('BRIZBEE_AUTH_TOKEN')
        }
        
        $rootScope.auth = {}
        $rootScope.auth.userId = $cookies.get('BRIZBEE_AUTH_USER_ID')
        $rootScope.auth.expiration = $cookies.get('BRIZBEE_AUTH_EXPIRATION')
        $rootScope.auth.token = $cookies.get('BRIZBEE_AUTH_TOKEN')

        $http.get($rootScope.baseUrl + "/odata/Users(" + $rootScope.auth.userId + ")?$expand=Organization")
            .then(response => {
                $rootScope.current = {}
                $rootScope.current.user = response.data
                
                // Reset the document title, in case the session expired
                $(document).prop('title', 'Dashboard - BRIZBEE')
            }, error => {
                $location.path("/")
            })
    }

    $scope.logout = function () {
        $http.defaults.headers.common = {}
        delete $rootScope.auth
        $rootScope.current = {}
        $cookies.remove('BRIZBEE_AUTH_USER_ID')
        $cookies.remove('BRIZBEE_AUTH_EXPIRATION')
        $cookies.remove('BRIZBEE_AUTH_TOKEN')
        $location.path('/')
    }

    $rootScope.formatMomentFromDate = function (date, format, timezone) {
        if (timezone != null) {
            return moment.parseZone(date).tz(timezone).format(format)
        } else {
            return moment.parseZone(date).format(format)
        }
    }
});
