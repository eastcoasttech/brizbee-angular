$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href)
    if (results != null)
    {
        return results[1] || 0
    }
    else
    {
        return ''
    }
}

app.controller('LoginController', function ($http, $location, $rootScope, $routeParams, $scope, $window) {
    $scope.messages = { error: '' }
    $scope.method = "pin"
    $scope.organization = {}
    $scope.user = {}
    $scope.working = { login: false }

    $scope.loginWithEmail = function () {
        // Authenticate the user with the email and password and
        // redirect to the status view
        $scope.working.login = true

        var json = {
            Session: {
                EmailAddress: $scope.session.EmailAddress,
                Method: "email",
                EmailPassword: $scope.session.EmailPassword
            }
        }
        $http.post($rootScope.baseUrl + "/odata/Users/Default.Authenticate", json)
            .then(response => {
                // User exists, redirect to status

                // Set the cookie
                $cookieStore.put('BRIZBEE_AUTH_USER_ID', response.data.AuthUserId)
                $cookieStore.put('BRIZBEE_AUTH_EXPIRATION', response.data.AuthExpiration)
                $cookieStore.put('BRIZBEE_AUTH_TOKEN', response.data.AuthToken)

                // Apply the http headers
                $http.defaults.headers.common = {
                    'AUTH_USER_ID': response.data.AuthUserId,
                    'AUTH_EXPIRATION': response.data.AuthExpiration,
                    'AUTH_TOKEN': response.data.AuthToken
                }

                $http.get($rootScope.baseUrl + "/odata/Users(" + response.data.AuthUserId + ")?$expand=Organization")
                    .then(response2 => {
                        $rootScope.current.user = response2.data
                    }, error2 => {
                        $scope.working.login = false
                        console.error(error2)
                    })

                $location.path('/status')
            }, error => {
                $scope.working.login = false
                $scope.messages.error = error.data.error.message
                console.error(error)
            })
    }

    $scope.loginWithPin = function () {
        // Authenticate the user with the organization code and pin and
        // redirect to the status view
        $scope.working.login = true

        var json = {
            Session: {
                Method: "pin",
                PinOrganizationCode: $scope.session.PinOrganizationCode,
                PinUserPin: $scope.session.PinUserPin
            }
        }
        $http.post($rootScope.baseUrl + "odata/Users/Default.Authenticate", json)
            .then(response => {
                // User exists, redirect to status

                // Set the cookie
                $cookieStore.put('BRIZBEE_AUTH_USER_ID', response.data.AuthUserId)
                $cookieStore.put('BRIZBEE_AUTH_EXPIRATION', response.data.AuthExpiration)
                $cookieStore.put('BRIZBEE_AUTH_TOKEN', response.data.AuthToken)

                $http.defaults.headers.common = {
                    'AUTH_USER_ID': response.data.AuthUserId,
                    'AUTH_EXPIRATION': response.data.AuthExpiration,
                    'AUTH_TOKEN': response.data.AuthToken
                }

                $http.get($rootScope.baseUrl + "/odata/Users(" + response.data.AuthUserId + ")?$expand=Organization")
                    .then(response2 => {
                        $rootScope.current.user = response2.data
                    }, error2 => {
                        $scope.working.login = false
                        console.error(error2)
                    })

                $location.path('/status')
            }, error => {
                $scope.working.login = false
                console.error(error)
            })
    }

    $scope.showMethod = function (method) {
        $scope.method = method

        if ($scope.method == "email") {
            $window.document.getElementById("session_email_address").focus()
        } else {
            $window.document.getElementById("session_pin_organization_code").focus()
        }
    }
    
    // Confirm the Email address if the proper parameters are passed
    var tokenId = $.urlParam('tokenId')
    var token = $.urlParam('token')
    if ((tokenId.length > 0) && (token.length > 0))
    {
        client.auth.provider('userpass').emailConfirm(tokenId, token)
            .then(function (result) {
                $location.search('tokenId', null)
                $location.search('token', null)
                $scope.isConfirmed = true
                $scope.$apply()
            }).catch(error => {
                console.error(error)
            })
    }

    // Focus on email input and scroll to top
    $window.document.getElementById("session_pin_organization_code").focus()
    $window.scrollTo(0, 0)
})
