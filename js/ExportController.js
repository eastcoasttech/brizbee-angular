app.controller('ExportController', function ($http, $rootScope, $scope, $uibModalInstance) {
    $scope.ok = function () {
        $uibModalInstance.close('Success')
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel')
    }
})