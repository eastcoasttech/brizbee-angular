app.controller('ExportController', function ($http, $rootScope, $scope, $uibModalInstance, type, commit_id, range) {
    $scope.commit_id = commit_id
    $scope.range = angular.copy(range)
    $scope.type = type
    $scope.auth = $rootScope.auth

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