app.controller('RegisterController', function ($http, $location, $rootScope, $routeParams, $scope, $timeout, $window) {
    $scope.filteredTimeZones = []
    $scope.user = {}
    $scope.organization = {}
    $scope.show = { success: false }
    $scope.working = { register: false }
    
    $scope.$watch('organization.CountryCode', function (newValue, oldValue, scope) {
        // Update the list of time zones
        // whenever the country is changed
        $scope.refreshTimeZones();
    });

    $scope.$watch('timezones', function (newValue, oldValue, scope) {
        if (newValue) {
            var guessed = moment.tz.guess();
            if (guessed != null && guessed != '') {
                var found = $scope.timezones[_.findIndex($scope.timezones, { Id: guessed })];
                $scope.organization.CountryCode = found.CountryCode;
                $timeout(function () {
                    $scope.organization.TimeZone = found;
                }, 10); // Delay to account for $watch setting to zero
            } else {
                var found = $scope.timezones[_.findIndex($scope.timezones, { Id: 'America/New_York' })];
                $scope.organization.CountryCode = found.CountryCode;
                $timeout(function () {
                    $scope.organization.TimeZone = found;
                }, 10); // Delay to account for $watch setting to zero
            }
        }
    });

    if ($routeParams.EmailAddress != null) {
        $scope.user.EmailAddress = $routeParams.EmailAddress
    }

    $scope.refreshTimeZones = function () {
        $scope.filteredTimeZones = _.filter($scope.timezones, function (t) {
            if (t.CountryCode == $scope.organization.CountryCode) {
                return t;
            }
        });
        $scope.organization.TimeZone = $scope.filteredTimeZones[0];
    }

    $scope.register = function () {
        $scope.working.register = true

        // Create the user and organization
        var json = {
            Organization: {
                Name: $scope.organization.Name,
                TimeZone: $scope.organization.TimeZone
            },
            User: {
                EmailAddress: $scope.user.EmailAddress,
                Name: $scope.user.Name,
                Password: $scope.user.Password
            }
        }
        $http.post($rootScope.baseUrl + "/odata/Users/Default.Register", json)
            .then(response => {
                $scope.working.register = false
                $scope.show.success = true
            }, error => {
                $scope.working.register = false
                console.error(error)
            })
    }

    // Focus on name input and scroll to top
    $window.document.getElementById("user_email_address").focus()
    $window.scrollTo(0, 0)
})
