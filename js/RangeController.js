app.controller('RangeController', function ($scope, $uibModalInstance, range) {
    $scope.datepicker = { InAt: {}, OutAt: {}, options: {} }
    $scope.range = { InAt: moment(range.IntAt).toDate(),
        OutAt: moment(range.OutAt).toDate() }
    
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
