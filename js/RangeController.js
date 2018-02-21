app.controller('RangeController', function ($scope, $uibModalInstance, range) {
    $scope.datepicker = { InAt: {}, OutAt: {}, options: {} }
    console.log(range)
    $scope.range = range
    
    $scope.ok = function () {
        $uibModalInstance.close($scope.range);
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }
    
    $scope.showOutAtDatepicker = function () {
        $scope.datepicker.OutAt.opened = true
    }

    $scope.showInAtDatepicker = function () {
        $scope.datepicker.InAt.opened = true
    }
});
