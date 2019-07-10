app.controller('ExportQuickBooksOnlineController', function ($http, $location, $rootScope, $routeParams, $sce, $scope, $timeout, $window, localStorageService) {
    $scope.step = {}

    $rootScope.$watch('range', function (newValue, oldValue, scope) {
        if ("CommitId" in newValue) {
            localStorageService.set('qbo_export_commit_id', newValue.CommitId)
        }
        if ("InAt" in newValue) {
            localStorageService.set('qbo_export_in_at', newValue.InAt)
        }
        if ("OutAt" in newValue) {
            localStorageService.set('qbo_export_out_at', newValue.OutAt)
        }
    })

    localStorageService.set('qbo_export_error_message', $routeParams.errorMessage)
    localStorageService.set('qbo_export_state_message', $routeParams.stateMessage)
    localStorageService.set('qbo_export_realm_id', $routeParams.realmId)
    localStorageService.set('qbo_export_access_token', $routeParams.accessToken)
    localStorageService.set('qbo_export_access_token_expires_at', $routeParams.accessTokenExpiresAt)
    localStorageService.set('qbo_export_refresh_token', $routeParams.refreshToken)
    localStorageService.set('qbo_export_refresh_token_expires_at', $routeParams.refreshTokenExpiresAt)

    function clearParams() {
        // $location.search('errorMessage', null)
        // $location.search('stateMessage', null)
        // $location.search('realmId', null)
        // $location.search('accessToken', null)
        // $location.search('accessTokenExpiresAt', null)
        // $location.search('refreshToken', null)
        // $location.search('refreshTokenExpiresAt', null)
    }
    clearParams()

    $scope.cancel = function () {
        $scope.showWelcome()
    }

    $scope.exportTimesheet = function (commit_id) {
        $scope.step = { name: 'status', number: '3', title: 'Please Wait' }
        // $http.get("https://brizbee.gowitheast.com/api/QuickBooksOnline/CompanyInformation?realmId=" + $scope.realmId + "&accessToken=" + $scope.accessToken)
        //     .then(response => {
        //         console.log(response)
        //     }, error => {
        //         console.error(error)
        //     })
    }

    $scope.showWelcome = function () {
        $scope.step = { name: 'welcome', number: '1', title: 'Connect to QuickBooks Online' }
    }
    $scope.showWelcome()

    $scope.trustedAction = function () {
        return $sce.trustAsResourceUrl("https://brizbee.gowitheast.com/api/QuickBooksOnline/Authenticate?AuthUserId=" + $rootScope.auth.userId + "&AuthExpiration=" + $rootScope.auth.expiration + "&AuthToken=" + $rootScope.auth.token);
    };
    
    // Step will be changed when QuickBooks Online API performs callback
    if ($routeParams.step && $routeParams.step == 'commit')
    {
        $scope.step = { name: 'commit', number: '2', title: 'Select Committed Punches' }
        $timeout(function () {
            // $location.search('step', null) // Clear the route param
        }, 1000)
    }

    // Scroll to top
    $window.scrollTo(0, 0)
})
