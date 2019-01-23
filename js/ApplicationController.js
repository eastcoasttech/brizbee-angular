app.controller('ApplicationController', function ($cookies, $http, $location, $rootScope, $scope) {
    $rootScope.baseUrl = "https://brizbeeweb.azurewebsites.net"
    // $rootScope.baseUrl = "http://localhost:54313"
    $rootScope.selected = {}
    $rootScope.current = {}
    $rootScope.range = {
        InAt: moment().startOf('day').toDate(),
        OutAt: moment().endOf('day').toDate()
    }
    $rootScope.timezones = moment.tz.names()
    console.log($rootScope.timezones)
    console.log(moment().startOf('day'))
    console.log(moment().startOf('day').toDate())
    console.log(moment().startOf('day').format())
    console.log(moment().utc().startOf('day').format())

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
                $(document).prop('title', 'BRIZBEE - Time Tracking and Employee Timesheet Software, Works with QuickBooks')
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

    $scope.formatMomentFromDate = function (date, format) {
        // $rootScope.current.user.Organization.TimeZone
        return moment(date).tz("America/New_York").format(format)
    }

    $scope.formatMomentUtcFromDate = function (date, format) {
        // $rootScope.current.user.Organization.TimeZone
        return moment(date).tz("America/New_York").utc().format(format)
    }
});
