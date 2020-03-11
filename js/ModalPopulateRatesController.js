app.controller('ModalPopulateRatesController', function ($http, $rootScope, $scope, $timeout, $uibModalInstance) {
  // $scope.exceptions = [{ option: 'Punches Before', time: moment().startOf('day').add('17', 'h').toDate() }];
  $scope.basePayrollRates = [];
  $scope.alternatePayrollRates = [];
  $scope.exceptions = [];
  $scope.timepicker = { hstep: 1, mstep: 1 };

  $scope.addException = function () {
    // $scope.exceptions.push({ option: 'Punches Before', time: moment().startOf('day').add('17', 'h').toDate() });
    $scope.exceptions.push({ option: 'After Hours/Minutes in Range', hour: 40, BasePayrollRate: $scope.basePayrollRates[0] });

    // Trigger the alternate rate to set default
    $scope.selectAlternateRate($scope.exceptions[$scope.exceptions.length - 1]);

    // Allow numbers only, must be applied every time
    $("input.form-control-number").numeric();
  };

  $scope.removeException = function (idx) {
    $scope.exceptions.splice(idx, 1);
  };

  $scope.refreshException = function () {
    // Allow numbers only, must be applied every time
    $("input.form-control-number").numeric();
  };
  
  $scope.basePayrollRates = function () {
    $http.get($rootScope.baseUrl + "/odata/Rates/Default.BasePayrollRatesForPunches(InAt='" + $scope.formatMomentFromDate($rootScope.range.InAt, 'YYYY-MM-DD') + "',OutAt='" + $scope.formatMomentFromDate($rootScope.range.OutAt, 'YYYY-MM-DD') + "')?$count=true")
      .then(response => {
        $scope.basePayrollRates = response.data.value;

        // Add the first exception
        $scope.addException();
      }, error => {
        console.error(error)
      });
  };

  $scope.refreshAlternateRates = function () {
    $http.get($rootScope.baseUrl + "/odata/Rates/Default.AlternatePayrollRatesForPunches(InAt='" + $scope.formatMomentFromDate($rootScope.range.InAt, 'YYYY-MM-DD') + "',OutAt='" + $scope.formatMomentFromDate($rootScope.range.OutAt, 'YYYY-MM-DD') + "')?$count=true")
      .then(response => {
        $scope.alternatePayrollRates = response.data.value;
      }, error => {
        console.error(error)
      });
  };

  $scope.selectAlternateRate = function (exception) {
    $timeout(function() {
      exception.AlternatePayrollRate = $scope.alternatePayrollRates[0];
    }, 50);
  };

  $scope.refreshTasks = function () {
    $http.get($rootScope.baseUrl + "/odata/Tasks/Default.ForPunches(InAt='" + $scope.formatMomentFromDate($rootScope.range.InAt, 'YYYY-MM-DD') + "',OutAt='" + $scope.formatMomentFromDate($rootScope.range.OutAt, 'YYYY-MM-DD') + "')?$count=true&$expand=BasePayrollRate,BaseServiceRate")
      .then(response => {
        $scope.tasks = response.data.value
        $scope.basePayrollRates();
        $scope.refreshAlternateRates();
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

  $scope.movePayrollExceptionUp = function (idx) {
    if (idx > 0) {
      var tmp = $scope.exceptions[idx];
      $scope.exceptions[idx] = $scope.exceptions[idx - 1];
      $scope.exceptions[idx - 1] = tmp;
    }
  };
  
  $scope.movePayrollExceptionDown = function (idx) {
    if (idx < $scope.exceptions.length - 1) {
      var tmp = $scope.exceptions[idx];
      $scope.exceptions[idx] = $scope.exceptions[idx + 1];
      $scope.exceptions[idx + 1] = tmp;
    }
  };

  $scope.filterAlternateRates = function (exception) {
    return function (rate) {
      if (rate.ParentRateId == exception.Id) {
        return true;
      }
      
      return false;
    };
  };
});
