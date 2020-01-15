app.controller('ModalExportController', function ($cookies, $scope, $uibModalInstance, localStorageService, commit_id) {
    $scope.auth = {}
    $scope.auth.userId = $cookies.get('BRIZBEE_AUTH_USER_ID')
    $scope.auth.expiration = $cookies.get('BRIZBEE_AUTH_EXPIRATION')
    $scope.auth.token = $cookies.get('BRIZBEE_AUTH_TOKEN')

    // Save the commit id for later
    localStorageService.set('qbo_export_commit_id', commit_id)

    $scope.cancel = function () {
        $uibModalInstance.dismiss()
    }

    $scope.formatMomentFromDate = function (date, format, timezone) {
        if (timezone != null) {
            return moment.parseZone(date).tz(timezone).format(format)
        } else {
            return moment.parseZone(date).format(format)
        }
    }

    $scope.ok = function () {
        $uibModalInstance.close()
    }
})