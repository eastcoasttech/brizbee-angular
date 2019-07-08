app.controller('ExportQuickBooksOnlineController', function ($http, $location, $rootScope, $routeParams, $scope, $timeout, $window) {
    $scope.step = {}

    $scope.errorMessage = $routeParams.errorMessage
    $scope.stateMessage = $routeParams.stateMessage
    $scope.realmId = $routeParams.realmId
    $scope.accessToken = $routeParams.accessToken
    $scope.accessTokenExpiresAt = $routeParams.accessTokenExpiresAt
    $scope.refreshToken = $routeParams.refreshToken
    $scope.refreshTokenExpiresAt = $routeParams.refreshTokenExpiresAt

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
