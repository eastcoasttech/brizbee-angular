app.controller('RangeController', function ($scope, $uibModalInstance, range) {
    $scope.datepicker = { InAt: {}, OutAt: {}, options: {} }
    $scope.range = range
    
    $scope.ok = function () {
        if (moment($scope.range.InAt).isAfter(moment($scope.range.OutAt))) {
            
        }
        else {
            $uibModalInstance.close($scope.range);
        }
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
