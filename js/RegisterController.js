app.controller('RegisterController', function ($cookies, $http, $location, $rootScope, $routeParams, $scope, $timeout, $window) {
    $scope.filteredTimeZones = []
    $scope.messages = { error: '' }
    $scope.new = { user: {}, users: [] }
    $scope.user = {}
    $scope.organization = {}
    $scope.selected = {}
    $scope.step = {}
    $scope.working = { register: false }

    // Reset the document title, in case the session expired
    $(document).prop('title', 'BRIZBEE - Login or Sign Up for a Free 30 Day Trial')

    $("input.form-control-number").numeric()
    
    $scope.$watch('selected.CountryCode', function (newValue, oldValue, scope) {
        // Update the list of time zones
        // whenever the country is changed
        $scope.refreshTimeZones()
    })

    // Add a slight delay
    function showRegister () {
        $scope.step = { name: 'register' }
    }
    // $timeout(showRegister, 3000)

    $scope.$watch('timezones', function (newValue, oldValue, scope) {
        if (newValue) {
            var guessed = moment.tz.guess()
            if (guessed != null && guessed != '') {
                var found = $scope.timezones[_.findIndex($scope.timezones, { Id: guessed })]
                $scope.selected.CountryCode = found.CountryCode
                $timeout(function () {
                    $scope.user.TimeZone = found
                }, 10) // Delay to account for $watch setting to zero
            } else {
                var found = $scope.timezones[_.findIndex($scope.timezones, { Id: 'America/New_York' })]
                $scope.selected.CountryCode = found.CountryCode
                $timeout(function () {
                    $scope.user.TimeZone = found
                }, 10) // Delay to account for $watch setting to zero
            }
        }
    })

    if ($routeParams.EmailAddress != null) {
        $scope.user.EmailAddress = $routeParams.EmailAddress
    }

    $scope.refreshTimeZones = function () {
        $scope.filteredTimeZones = _.filter($scope.timezones, function (t) {
            if (t.CountryCode == $scope.selected.CountryCode) {
                return t
            }
        })
        $scope.user.TimeZone = $scope.filteredTimeZones[0]
    }

    $scope.register = function () {
        $scope.working.register = true

        // Create the user and organization
        var registerJson = {
            Organization: {
                Name: $scope.organization.Name,
                Code: Math.floor((Math.random() * 99999) + 10000).toString(),
            },
            User: {
                EmailAddress: $scope.user.EmailAddress,
                Name: $scope.user.Name,
                Password: $scope.user.Password,
                Pin: Math.floor((Math.random() * 99999) + 10000).toString(),
                TimeZone: $scope.user.TimeZone.Id
            }
        }
        $http.post($rootScope.baseUrl + "/odata/Users/Default.Register", registerJson)
            .then(registerResponse => {
                // Login the new user
                var sessionJson = {
                    Session: {
                        EmailAddress: $scope.user.EmailAddress,
                        Method: "email",
                        EmailPassword: $scope.user.Password
                    }
                }
                $http.post($rootScope.baseUrl + "/odata/Users/Default.Authenticate", sessionJson)
                    .then(loginResponse => {
                        // Set the cookie
                        $cookies.put('BRIZBEE_AUTH_USER_ID', loginResponse.data.AuthUserId)
                        $cookies.put('BRIZBEE_AUTH_EXPIRATION', loginResponse.data.AuthExpiration)
                        $cookies.put('BRIZBEE_AUTH_TOKEN', loginResponse.data.AuthToken)

                        // Apply the http headers
                        $http.defaults.headers.common = {
                            'AUTH_USER_ID': loginResponse.data.AuthUserId,
                            'AUTH_EXPIRATION': loginResponse.data.AuthExpiration,
                            'AUTH_TOKEN': loginResponse.data.AuthToken
                        }

                        // Auth is used and links and such
                        $rootScope.auth = {}
                        $rootScope.auth.userId = $cookies.get('BRIZBEE_AUTH_USER_ID')
                        $rootScope.auth.expiration = $cookies.get('BRIZBEE_AUTH_EXPIRATION')
                        $rootScope.auth.token = $cookies.get('BRIZBEE_AUTH_TOKEN')

                        // Get the user details
                        $http.get($rootScope.baseUrl + "/odata/Users(" + loginResponse.data.AuthUserId + ")?$expand=Organization")
                            .then(detailsResponse => {
                                $rootScope.current.user = detailsResponse.data
                                $scope.user.Id = detailsResponse.data.Id
                                $scope.organization.Id = detailsResponse.data.OrganizationId
                                $scope.showPin()
                            }, detailsError => {
                                $scope.working.register = false
                                $scope.messages.error = detailsError.data.error.message
                                console.error(detailsError)
                            })
                    }, loginError => {
                        $scope.working.register = false
                        $scope.messages.error = loginError.data.error.message
                        console.error(loginError)
                    })
            }, registerError => {
                $scope.working.register = false
                $scope.messages.error = registerError.data.error.message
                console.error(registerError)
            })
    }

    $scope.savePin = function () {
        $scope.working.pin = true

        // Update the organization code
        var organizationJson = {
            Code: $scope.organization.Code.toString()
        }
        $http.patch($rootScope.baseUrl + "/odata/Organizations(" + $scope.organization.Id + ")", organizationJson)
            .then(organizationResponse => {

                // Update the user pin
                var userJson = {
                    Pin: $scope.user.Pin.toString()
                }
                $http.patch($rootScope.baseUrl + "/odata/Users(" + $scope.user.Id + ")", userJson)
                    .then(userResponse => {
                        $rootScope.current.user.Pin = $scope.user.Pin.toString()
                        $rootScope.current.user.Organization.Code = $scope.organization.Code.toString()
                        $scope.showUsers()
                    }, userError => {
                        $scope.working.pin = false
                        console.error(userError)
                        alert(userError)
                    })
            }, organizationError => {
                $scope.working.pin = false
                console.error(organizationError)
                alert(organizationError)
            })
    }

    $scope.saveUser = function () {
        var json = {
            Name: $scope.new.user.Name,
            Role: 'Standard',
            Pin: $scope.new.user.Pin.toString(),
            TimeZone: $scope.user.TimeZone.Id
        }

        if ($scope.new.user.EmailAddress != '') {
            json.EmailAddress = $scope.new.user.EmailAddress
        }

        $http.post($rootScope.baseUrl + "/odata/Users", json)
            .then(response => {
                $scope.new.users.push(angular.copy($scope.new.user))
                $scope.new.user = {}
                function focusNewUserName () {
                    $window.document.getElementById("new_user_name").focus()
                }
                $timeout(focusNewUserName, 10)
            }, error => {
                console.error(error)
                alert(error)
            })
    }

    $scope.showUsers = function () {
        $scope.step = { name: 'users', number: '3', title: 'Add Your Employees' }
        function focusNewUserName () {
            $window.document.getElementById("new_user_name").focus()
        }
        $timeout(focusNewUserName, 10)
    }

    $scope.showPin = function () {
        $scope.step = { name: 'pin', number: '2', title: 'Set Your Organization Code and PIN' }
        function focusOrganizationCode () {
            $window.document.getElementById("organization_code").focus()
        }
        $timeout(focusOrganizationCode, 10)
    }

    $scope.showRegister = function () {
        $scope.step = { name: 'register', number: '1', title: 'Sign Up for BRIZBEE' }
    }

    $scope.showRegister()

    // Focus on name input and scroll to top
    $window.document.getElementById("user_email_address").focus()
    $window.scrollTo(0, 0)
})
