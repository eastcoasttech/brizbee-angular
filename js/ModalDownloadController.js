app.controller('ModalDownloadController', function ($cookies, $scope, $uibModalInstance, range) {
    $scope.range = angular.copy(range)
    
    $scope.auth = {}
    $scope.auth.userId = $cookies.get('BRIZBEE_AUTH_USER_ID')
    $scope.auth.expiration = $cookies.get('BRIZBEE_AUTH_EXPIRATION')
    $scope.auth.token = $cookies.get('BRIZBEE_AUTH_TOKEN')

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