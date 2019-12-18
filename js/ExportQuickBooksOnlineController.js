app.controller('ExportQuickBooksOnlineController', function ($http, $location, $rootScope, $routeParams, $sce, $scope, $timeout, $window, localStorageService) {
    $scope.step = {}
    $scope.details = { InAt: null, OutAt: null, CompanyName: '' }
    $scope.loading = { commits: false }
    $scope.selected = { commitId: null }
    $scope.working = { export: false }

    $rootScope.$watch('range', function (newValue, oldValue, scope) {
        // if ("CommitId" in newValue) {
        //     localStorageService.set('qbo_export_commit_id', newValue.CommitId)
        // }
        if ("InAt" in newValue) {
            localStorageService.set('qbo_export_in_at', $scope.formatMomentFromDate(newValue.InAt, 'YYYY-MM-DD'))
            $scope.details.InAt = newValue.InAt
        }
        if ("OutAt" in newValue) {
            localStorageService.set('qbo_export_out_at', $scope.formatMomentFromDate(newValue.OutAt, 'YYYY-MM-DD'))
            $scope.details.OutAt = newValue.OutAt
        }
    })

    localStorageService.set('qbo_export_error_message', $routeParams.errorMessage)
    localStorageService.set('qbo_export_state_message', $routeParams.stateMessage)
    localStorageService.set('qbo_export_realm_id', $routeParams.realmId)
    localStorageService.set('qbo_export_access_token', $routeParams.accessToken)
    localStorageService.set('qbo_export_access_token_expires_at', $routeParams.accessTokenExpiresAt)
    localStorageService.set('qbo_export_refresh_token', $routeParams.refreshToken)
    localStorageService.set('qbo_export_refresh_token_expires_at', $routeParams.refreshTokenExpiresAt)

    $scope.cancel = function () {
        $scope.showWelcome()
    }

    $scope.confirm = function (commit_id) {
        $scope.working.export = true
        var realmId = localStorageService.get('qbo_export_realm_id')
        var accessToken = localStorageService.get('qbo_export_access_token')
        var inAt = localStorageService.get('qbo_export_in_at')
        var outAt = localStorageService.get('qbo_export_out_at')
        var commitId = localStorageService.get('qbo_export_commit_id')
        $http.post("https://brizbee.gowitheast.com/api/QuickBooksOnline/TimeActivities?realmId=" + realmId + "&accessToken=" + accessToken + "&inAt=" + inAt + "&outAt=" + outAt + "&commitId=" + commitId)
            .then(response => {
                console.log(response)
                $scope.working.export = false
            }, error => {
                console.error(error)
                $scope.working.export = false
            })
    }

    $scope.refreshCommits = function () {
        $scope.commits = []
        $scope.loading.commits = true
        $http.get($rootScope.baseUrl + "/odata/Commits?$orderby=InAt desc")
            .then(response => {
                $scope.loading.commits = false
                $scope.commits = response.data.value
                $scope.selected.commitId = $scope.commits[0].Id
            }, error => {
                $scope.loading.commits = false
                console.error(error)
            })
    }

    $scope.trustedAction = function () {
        return $sce.trustAsResourceUrl("https://brizbee.gowitheast.com/api/QuickBooksOnline/Authenticate?AuthUserId=" + $rootScope.auth.userId + "&AuthExpiration=" + $rootScope.auth.expiration + "&AuthToken=" + $rootScope.auth.token)
    }

    $scope.showWelcome = function () {
        $scope.step = { name: 'welcome', number: '1', title: 'Connect to QuickBooks Online' }
    }
    $scope.showWelcome()
    
    // Step will be changed when QuickBooks Online API performs callback
    if ($routeParams.step && $routeParams.step == 'company')
    {
        // Load InAt from localStorage stored in previous request
        if (localStorageService.get('qbo_export_in_at'))
        {
            $rootScope.range.InAt = localStorageService.get('qbo_export_in_at')
        }
        
        // Load OutAt from localStorage stored in previous request
        if (localStorageService.get('qbo_export_out_at'))
        {
            $rootScope.range.OutAt = localStorageService.get('qbo_export_out_at')
        }

        // Set the step
        $scope.step = { name: 'company', number: '2', title: 'Loading Company Details' }

        // Ask the server to get the company details from QBO
        var realmId = localStorageService.get('qbo_export_realm_id')
        var accessToken = localStorageService.get('qbo_export_access_token')
        $http.get("https://brizbee.gowitheast.com/api/QuickBooksOnline/CompanyInformation?realmId=" + realmId + "&accessToken=" + accessToken)
            .then(response => {
                $scope.details.CompanyName = response.data
                $scope.step = { name: 'confirm', number: '3', title: 'Confirm the Export' }

                // Refresh the list of commits for user to choose
                $scope.refreshCommits();
            }, error => {
                console.error(error)
            })
    }

    // Scroll to top
    $window.scrollTo(0, 0)
})
