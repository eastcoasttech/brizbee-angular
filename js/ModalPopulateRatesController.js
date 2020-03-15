app.controller('ModalPopulateRatesController', function ($http, $rootScope, $scope, $timeout, $uibModalInstance) {
  $scope.basePayrollRates = [];
  $scope.baseServiceRates = [];
  $scope.alternatePayrollRates = [];
  $scope.alternateServiceRates = [];
  $scope.payrollExceptions = [];
  $scope.serviceExceptions = [];
  $scope.timepicker = { hstep: 1, mstep: 1 };
  $scope.datepicker = {};
  $scope.working = { ok: false };

  $scope.addPayrollException = function () {
    $scope.payrollExceptions.push({ option: 'After Hours/Minutes in Range', hour: 40, BasePayrollRate: $scope.basePayrollRates[0], date: new Date() });

    // Trigger the alternate rate to set default
    $scope.selectPayrollAlternateRate($scope.payrollExceptions[$scope.payrollExceptions.length - 1]);

    // Allow numbers only, must be applied every time
    $("input.form-control-number").numeric();
  };
  
  $scope.addServiceException = function () {
    $scope.serviceExceptions.push({ option: 'After Hours/Minutes in Range', hour: 40, BaseServiceRate: $scope.baseServiceRates[0], date: new Date() });

    // Trigger the alternate rate to set default
    $scope.selectServiceAlternateRate($scope.serviceExceptions[$scope.serviceExceptions.length - 1]);

    // Allow numbers only, must be applied every time
    $("input.form-control-number").numeric();
  };

  /**
   * Removes the payroll exception at the given index.
   */
  $scope.removePayrollException = function (idx) {
    $scope.payrollExceptions.splice(idx, 1);
  };
  
  /**
   * Removes the service exception at the given index.
   */
  $scope.removeServiceException = function (idx) {
    $scope.serviceExceptions.splice(idx, 1);
  };

  // $scope.refreshException = function () {
  //   // Allow numbers only, must be applied every time
  //   $("input.form-control-number").numeric();
  // };
  
  /**
   * Refreshes the list of base payroll rates from the server
   * and adds a default payroll rate exception.
   */
  $scope.refreshBasePayrollRates = function () {
    $http.get($rootScope.baseUrl + "/odata/Rates/Default.BasePayrollRatesForPunches(InAt='" + $scope.formatMomentFromDate($rootScope.range.InAt, 'YYYY-MM-DD') + "',OutAt='" + $scope.formatMomentFromDate($rootScope.range.OutAt, 'YYYY-MM-DD') + "')?$count=true")
      .then(response => {
        $scope.basePayrollRates = response.data.value;

        // Add the first exception
        $scope.addPayrollException();
      }, error => {
        console.error(error)
      });
  };

  /**
   * Refreshes the list of alternate payroll rates from the server.
   */
  $scope.refreshAlternatePayrollRates = function () {
    $http.get($rootScope.baseUrl + "/odata/Rates/Default.AlternatePayrollRatesForPunches(InAt='" + $scope.formatMomentFromDate($rootScope.range.InAt, 'YYYY-MM-DD') + "',OutAt='" + $scope.formatMomentFromDate($rootScope.range.OutAt, 'YYYY-MM-DD') + "')?$count=true")
      .then(response => {
        $scope.alternatePayrollRates = response.data.value;
      }, error => {
        console.error(error)
      });
  };

  /**
   * Refreshes the list of base service rates from the server
   * and adds a default service rate exception.
   */
  $scope.refreshBaseServiceRates = function () {
    $http.get($rootScope.baseUrl + "/odata/Rates/Default.BaseServiceRatesForPunches(InAt='" + $scope.formatMomentFromDate($rootScope.range.InAt, 'YYYY-MM-DD') + "',OutAt='" + $scope.formatMomentFromDate($rootScope.range.OutAt, 'YYYY-MM-DD') + "')?$count=true")
      .then(response => {
        $scope.baseServiceRates = response.data.value;

        // Add the first exception
        $scope.addServiceException();
      }, error => {
        console.error(error)
      });
  };

  /**
   * Refreshes the list of alternate service rates from the server.
   */
  $scope.refreshAlternateServiceRates = function () {
    $http.get($rootScope.baseUrl + "/odata/Rates/Default.AlternateServiceRatesForPunches(InAt='" + $scope.formatMomentFromDate($rootScope.range.InAt, 'YYYY-MM-DD') + "',OutAt='" + $scope.formatMomentFromDate($rootScope.range.OutAt, 'YYYY-MM-DD') + "')?$count=true")
      .then(response => {
        $scope.alternateServiceRates = response.data.value;
      }, error => {
        console.error(error)
      });
  };

  $scope.selectPayrollAlternateRate = function (exception) {
    $timeout(function() {
      exception.AlternatePayrollRate = $scope.alternatePayrollRates[0];
    }, 50);
  };
  
  $scope.selectServiceAlternateRate = function (exception) {
    $timeout(function() {
      exception.AlternateServiceRate = $scope.alternateServiceRates[0];
    }, 50);
  };

  $scope.refreshTasks = function () {
    $http.get($rootScope.baseUrl + "/odata/Tasks/Default.ForPunches(InAt='" + $scope.formatMomentFromDate($rootScope.range.InAt, 'YYYY-MM-DD') + "',OutAt='" + $scope.formatMomentFromDate($rootScope.range.OutAt, 'YYYY-MM-DD') + "')?$count=true&$expand=BasePayrollRate,BaseServiceRate")
      .then(response => {
        $scope.tasks = response.data.value;
        $scope.refreshBasePayrollRates();
        $scope.refreshAlternatePayrollRates();
        $scope.refreshBaseServiceRates();
        $scope.refreshAlternateServiceRates();
      }, error => {
        console.error(error);
      });
  };
  $scope.refreshTasks();

  $scope.cancel = function () {
    $uibModalInstance.dismiss();
  };

  /**
   * Builds payload for populate rate options and sends them to the server.
   */
  $scope.ok = function () {
    $scope.working.ok = true;

    var populateRateOptions = [];

    // Payroll exceptions
    for (var i = 0; i < $scope.payrollExceptions.length; i++) {
      var exception = $scope.payrollExceptions[i];

      // Build the PopulateRateOption
      var option = buildPopulateRateOption(exception);
      option.BasePayrollRateId = exception.BasePayrollRate.Id;
      option.AlternatePayrollRateId = exception.AlternatePayrollRate.Id;
      option.Order = i;

      // Add to the list of populate rate options
      populateRateOptions.push(option);
    }

    // Service exceptions
    for (var i = 0; i < $scope.serviceExceptions.length; i++) {
      var exception = $scope.serviceExceptions[i];
      
      // Build the PopulateRateOption
      var option = buildPopulateRateOption(exception);
      option.BaseServiceRateId = exception.BaseServiceRate.Id;
      option.AlternateServiceRateId = exception.AlternateServiceRate.Id;
      option.Order = $scope.payrollExceptions.length + i; // Service exceptions take secondary priority

      // Add to the list of populate rate options
      populateRateOptions.push(option);
    }

    var json = {
      Options: {
        Options: populateRateOptions,
        InAt: $scope.formatMomentFromDate($rootScope.range.InAt, 'YYYY-MM-DD'),
        OutAt: $scope.formatMomentFromDate($rootScope.range.OutAt, 'YYYY-MM-DD')
      }
    };
    $http.post($rootScope.baseUrl + "/odata/Punches/Default.PopulateRates", JSON.stringify(json))
      .then(response => {
        $uibModalInstance.close();
      }, error => {
        $scope.working.ok = false;
      });
  };

  function buildPopulateRateOption (exception) {
    var option = {};

    switch (exception.option) {
      case "Punches Before":
        option.Type = "range";
        option.RangeDirection = "before";
        var time = moment(exception.time);
        option.RangeMinutes = (parseInt(time.format("H")) * 60) + parseInt(time.format("m"));
        break;
      case "Punches After":
        option.Type = "range";
        option.RangeDirection = "after";
        var time = moment(exception.time);
        option.RangeMinutes = (parseInt(time.format("H")) * 60) + parseInt(time.format("m"));
        break;
      case "After Hours/Minutes Per Day":
        option.Type = "count";
        option.CountScope = "day";
        var exceptionHour = 0;
        var exceptionMinute = 0;
        if (typeof exception.hour !== 'undefined') {
          exceptionHour = parseInt(exception.hour) * 60;
        }
        if (typeof exception.minute !== 'undefined') {
          exceptionMinute = parseInt(exception.minute);
        }
        option.CountMinute = exceptionHour + exceptionMinute;
        break;
      case "After Hours/Minutes in Range":
        option.Type = "count";
        option.CountScope = "total";
        var exceptionHour = 0;
        var exceptionMinute = 0;
        if (typeof exception.hour !== 'undefined') {
          exceptionHour = parseInt(exception.hour) * 60;
        }
        if (typeof exception.minute !== 'undefined') {
          exceptionMinute = parseInt(exception.minute);
        }
        option.CountMinute = exceptionHour + exceptionMinute;
        break;
      case "Punches on Specific Date":
        option.Type = "date";
        var date = moment(exception.date);
        option.Date = date.format("YYYY-MM-DD");
        break;
    }

    return option;
  }

  $scope.movePayrollExceptionUp = function (idx) {
    if (idx > 0) {
      var tmp = $scope.payrollExceptions[idx];
      $scope.payrollExceptions[idx] = $scope.payrollExceptions[idx - 1];
      $scope.payrollExceptions[idx - 1] = tmp;
    }
  };
  
  $scope.movePayrollExceptionDown = function (idx) {
    if (idx < $scope.payrollExceptions.length - 1) {
      var tmp = $scope.payrollExceptions[idx];
      $scope.payrollExceptions[idx] = $scope.payrollExceptions[idx + 1];
      $scope.payrollExceptions[idx + 1] = tmp;
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
