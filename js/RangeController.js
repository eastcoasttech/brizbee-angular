app.controller('RangeController', function ($scope, $uibModalInstance, range) {
    $scope.datepicker = { InAt: {}, OutAt: {}, options: {} }
    $scope.range = angular.copy(range)
    
    $scope.ok = function () {
        if (moment($scope.range.OutAt).isAfter(moment($scope.range.InAt))) {
            $uibModalInstance.close($scope.range);
        }
        else {
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
