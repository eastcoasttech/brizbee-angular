app.controller('ModalPopulateRatesController', function ($http, $rootScope, $scope, $uibModalInstance) {
  // $scope.exceptions = [{ option: 'Punches Before', time: moment().startOf('day').add('17', 'h').toDate() }];
  $scope.exceptions = [{ option: 'After Quantity in Range', hour: 40 }];
  $scope.timepicker = { hstep: 1, mstep: 1 };

  $scope.addException = function () {
    // $scope.exceptions.push({ option: 'Punches Before', time: moment().startOf('day').add('17', 'h').toDate() });
    $scope.exceptions.push({ option: 'After Quantity in Range', hour: 40 });

    // Allow numbers only, must be applied every time
    $("input.form-control-number").numeric();
  }

  $scope.removeException = function (idx) {
    $scope.exceptions.splice(idx, 1);
  }

  $scope.refreshException = function () {
    // Allow numbers only, must be applied every time
    $("input.form-control-number").numeric();
  }

  $scope.refreshAlternateRates = function () {

  };

  $scope.refreshTasks = function () {
    $http.get($rootScope.baseUrl + "/odata/Tasks/Default.ForPunches(InAt='" + $scope.formatMomentFromDate($rootScope.range.InAt, 'YYYY-MM-DD') + "',OutAt='" + $scope.formatMomentFromDate($rootScope.range.OutAt, 'YYYY-MM-DD') + "')?$count=true&$expand=BasePayrollRate,BaseServiceRate")
      .then(response => {
        $scope.tasks = response.data.value
      }, error => {
        console.error(error)
      });
  };
  $scope.refreshTasks();

  $scope.cancel = function () {
    $uibModalInstance.dismiss();
  };

  $scope.ok = function () {
    $uibModalInstance.close();
  };
});
