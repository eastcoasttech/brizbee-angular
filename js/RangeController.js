app.controller('RangeController', function ($scope, $uibModalInstance, range) {
    $scope.datepicker = { in_at: {}, out_at: {}, options: {} }
    $scope.range = range
    
    $scope.ok = function () {
        $uibModalInstance.close($scope.range);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
    $scope.showOutAtDatepicker = function () {
        $scope.datepicker.out_at.opened = true
    };

    $scope.showInAtDatepicker = function () {
        $scope.datepicker.in_at.opened = true
    };
});
