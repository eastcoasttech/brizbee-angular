app.controller('ModalExportController', function ($cookies, $scope, $uibModalInstance) {
    $scope.auth = {}
    $scope.auth.userId = $cookies.get('BRIZBEE_AUTH_USER_ID')
    $scope.auth.expiration = $cookies.get('BRIZBEE_AUTH_EXPIRATION')
    $scope.auth.token = $cookies.get('BRIZBEE_AUTH_TOKEN')

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel')
    }

    $scope.formatMomentFromDate = function (date, format, timezone) {
        if (timezone != null) {
            return moment.parseZone(date).tz(timezone).format(format)
        } else {
            return moment.parseZone(date).format(format)
        }
    }

    $scope.ok = function () {
        $uibModalInstance.close('Success')
    }
})