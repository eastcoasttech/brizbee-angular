app.controller('ApplicationController', function ($cookieStore, $http, $location, $rootScope, $scope) {
    $rootScope.baseUrl = "https://brizbeeweb.azurewebsites.net/"
    $rootScope.selected = {}
    $rootScope.current = {}
    $rootScope.range = {
        InAt: moment().startOf('day').toDate(),
        OutAt: moment().endOf('day').toDate()
    }

    if ($cookieStore.get('BRIZBEE_AUTH_USER_ID'))
    {
        $http.defaults.headers.common = {
            'AUTH_USER_ID': $cookieStore.get('BRIZBEE_AUTH_USER_ID'),
            'AUTH_EXPIRATION': $cookieStore.get('BRIZBEE_AUTH_EXPIRATION'),
            'AUTH_TOKEN': $cookieStore.get('BRIZBEE_AUTH_TOKEN')
        }
        
        $rootScope.auth = {}
        $rootScope.auth.userId = $cookieStore.get('BRIZBEE_AUTH_USER_ID')
        $rootScope.auth.expiration = $cookieStore.get('BRIZBEE_AUTH_EXPIRATION')
        $rootScope.auth.token = $cookieStore.get('BRIZBEE_AUTH_TOKEN')

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
        $cookieStore.remove('BRIZBEE_AUTH_USER_ID')
        $cookieStore.remove('BRIZBEE_AUTH_EXPIRATION')
        $cookieStore.remove('BRIZBEE_AUTH_TOKEN')
        $location.path('/')
    }

    $scope.showMomentDate = function (date, format) {
        return moment(date).format(format)
    }
});
