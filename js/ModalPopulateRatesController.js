app.controller('ModalPopulateRatesController', function ($cookies, $scope, $uibModalInstance) {
    $scope.exceptions = [{ option: 'Punches Before', time: moment().startOf('day').add('17', 'h').toDate() }]
    $scope.timepicker = { hstep: 1, mstep: 1 }

    $scope.addException = function () {
        $scope.exceptions.push({ option: 'Punches Before', time: moment().startOf('day').add('17', 'h').toDate() })

        // Allow numbers only, must be applied every time
        $("input.form-control-number").numeric()
    }

    $scope.removeException = function (idx) {
        $scope.exceptions.splice(idx, 1)
    }

    $scope.refreshException = function () {
        // Allow numbers only, must be applied every time
        $("input.form-control-number").numeric()
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss()
    }

    $scope.ok = function () {
        $uibModalInstance.close()
    }
})
