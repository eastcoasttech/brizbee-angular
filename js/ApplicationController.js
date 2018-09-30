app.controller('ApplicationController', function ($cookies, $http, $location, $rootScope, $scope) {
    $rootScope.baseUrl = "https://brizbeeweb.azurewebsites.net/"
    $rootScope.selected = {}
    $rootScope.current = {}
    $rootScope.range = {
        InAt: moment().startOf('day').toDate(),
        OutAt: moment().endOf('day').toDate()
    }

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

        $http.get($rootScope.baseUrl + "/odata/Users(" + $rootScope.auth.userId + ")")
            .then(response => {
                $rootScope.current = {}
                $rootScope.current.user = response.data

                // Reset the document title, in case the session expired
                $(document).prop('title', 'BRIZBEE - Time Tracking')
            }, error => {
                $location.path("/")
            })
    }

    $scope.logout = function () {
        $http.defaults.headers.common = {}
        delete $rootScope.auth
        $rootScope.current = {} //delete $rootScope.current;
        $cookies.remove('BRIZBEE_AUTH_USER_ID')
        $cookies.remove('BRIZBEE_AUTH_EXPIRATION')
        $cookies.remove('BRIZBEE_AUTH_TOKEN')
        $location.path('/')
    }

    $scope.showMomentDate = function (date, format) {
        return moment(date).format(format)
    }

    // Disable mousewheel on a input number field when in focus
    // (to prevent Cromium browsers change the value when scrolling)
    $(':input[type=number]').on('mousewheel',function(e){ $(this).blur(); });

    $("input.form-control-number").numeric();
});
