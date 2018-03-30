app.controller('SplitController', function ($scope, $uibModalInstance) {
    $scope.ok = function () {
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }
});