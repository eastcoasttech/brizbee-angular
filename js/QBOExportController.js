app.controller('QBOExportController', function ($http, $location, $rootScope, $routeParams, $sce, $scope, $timeout, $window, localStorageService) {
    $scope.step = {}
    $scope.details = { InAt: null, OutAt: null, CompanyName: '' }
    $scope.loading = { commits: false }
    $scope.selected = { commit: null }
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
        var result = $window.confirm("Are you sure you want to cancel the export?");
        if (result == true) {
            $location.path('/commits')
        }
    }

    $scope.confirm = function (commit_id) {
        // Move to status step
        $scope.step = { name: 'status', number: '4', title: 'Exporting...' }
        $scope.working.export = true

        var realmId = localStorageService.get('qbo_export_realm_id')
        var accessToken = localStorageService.get('qbo_export_access_token')
        $http.post("https://brizbee.gowitheast.com/api/QuickBooksOnline/ExportCommit?realmId=" + realmId + "&accessToken=" + accessToken + "&commitId=" + $scope.selected.commit.Id)
            .then(response => {
                console.log(response)
                // Move to finished step
                $scope.step = { name: 'finished', number: '5', title: 'Finished' }
                $scope.working.export = false
            }, error => {
                console.error(error)
                // Move to finished step
                $scope.step = { name: 'errors', number: '5', title: 'Failed' }
                $scope.errors = error.data
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
                $scope.selected.commit = $scope.commits[0]
            }, error => {
                $scope.loading.commits = false
                console.error(error)
            })
    }

    $scope.refreshCommit = function () {
        $scope.loading.commits = true

        // Load commit from localStorage stored previously
        if (localStorageService.get('qbo_export_commit_id'))
        {
            var commit_id = localStorageService.get('qbo_export_commit_id')
            $http.get($rootScope.baseUrl + "/odata/Commits(" + commit_id + ")")
                .then(response => {
                    $scope.loading.commits = false
                    $scope.selected.commit = response.data
                }, error => {
                    $scope.loading.commits = false
                    console.error(error)
                })
        }
    }

    $scope.trustedAction = function () {
        return $sce.trustAsResourceUrl("https://brizbee.gowitheast.com/api/QuickBooksOnline/Authenticate?route=qbo-export&AuthUserId=" + $rootScope.auth.userId + "&AuthExpiration=" + $rootScope.auth.expiration + "&AuthToken=" + $rootScope.auth.token)
    }

    $scope.showWelcome = function () {
        $scope.step = { name: 'welcome', number: '1', title: 'Connect to QuickBooks Online' }
    }
    $scope.showWelcome()

    $scope.tryAgain = function () {
        $scope.step = { name: 'confirm', number: '3', title: 'Confirm the Export' }
        $scope.errors = null;
    }
    
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
                // $scope.refreshCommits();
                $scope.refreshCommit()
            }, error => {
                console.error(error)
            })
    }

    // Scroll to top
    $window.scrollTo(0, 0)
})
