app.controller("ModalPopulateRatesController",
    function ($http, $rootScope, $scope, $uibModalInstance) {

    $scope.datepicker = { options: {} };
    $scope.payrollExceptions = [];
    $scope.serviceExceptions = [];
    $scope.timepicker = { hstep: 1, mstep: 1 };

    $scope.addPayrollException = function () {
        var exception = {
            option: "Punches Before Time",
            date: moment().startOf("day").toDate(),
            time: moment().startOf("day").add("8", "h").toDate(),
            baseRate: $scope.basePayrollRates[0],
            opened: false
        };
        $scope.payrollExceptions.push(exception);
        $scope.refreshAlternateRates(exception);
    };

    $scope.removePayrollException = function (idx) {
        $scope.payrollExceptions.splice(idx, 1);
    };

    $scope.refreshTasks = function () {
        $http.get($rootScope.baseUrl + "/odata/Tasks/Default.ForPunches(InAt='2020-01-01',OutAt='2020-01-31')?$expand=BasePayrollRate,BaseServiceRate")
            .then(function (response) {
                $scope.tasks = response.data.value;
            }, function (error) {
                console.error(error);
            });
    };

    $scope.refreshBaseRates = function () {
        $http.get($rootScope.baseUrl + "/odata/Rates/Default.BaseServiceRatesForPunches(InAt='2020-01-01',OutAt='2020-01-31')")
            .then(function (response) {
                $scope.baseServiceRates = response.data.value;

                // Add first exception
                // $scope.addServiceException();
            }, function (error) {
                console.error(error);
            });

        $http.get($rootScope.baseUrl + "/odata/Rates/Default.BasePayrollRatesForPunches(InAt='2020-01-01',OutAt='2020-01-31')")
            .then(function (response) {
                $scope.basePayrollRates = response.data.value;

                // Add first exception
                $scope.addPayrollException();
            }, function (error) {
                console.error(error);
            });
    };

    $scope.refreshAlternateRates = function (exception) {
        $http.get($rootScope.baseUrl + "/odata/Rates?$orderby=Name&$filter=ParentRateId eq " + exception.baseRate.Id)
            .then(function (response) {
                exception.alternateRates = response.data.value;

                // Select the first alternate rate
                exception.alternateRate = exception.alternateRates[0];
            }, function (error) {
                console.error(error);
            });
    };

    $scope.showDatepicker = function (exception) {
        exception.opened = true;
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };

    $scope.ok = function () {
        var options = [],
            length = $scope.payrollExceptions.length,
            exception = null;

        for (var i = 0; i < length; i++) {
            exception = $scope.payrollExceptions[i];
            switch (exception.option) {
            case "Punches Before Time":
                options.push({
                    Order: i,
                    BasePayrollRateId: exception.baseRate.Id,
                    AlternatePayrollRateId: exception.alternateRate.Id,
                    Type: 'range',
                    RangeDirection: 'before',
                    RangeMinutes: moment(exception.time).format("HH:mm")
                });
                break;
            case "Punches After Time":
                options.push({
                    Order: i,
                    BasePayrollRateId: exception.baseRate.Id,
                    AlternatePayrollRateId: exception.alternateRate.Id,
                    Type: 'range',
                    RangeDirection: 'after',
                    RangeMinutes: moment(exception.time).format("HH:mm")
                });
                break;
            case "After Quantity Per Day":
                options.push({
                    Order: i,
                    BasePayrollRateId: exception.baseRate.Id,
                    AlternatePayrollRateId: exception.alternateRate.Id,
                    Type: 'count',
                    CountScope: 'day',
                    CountMinute: (exception.quantity.hours == null ? 0 : parseInt(exception.quantity.hours) * 60) +
                        (exception.quantity.minutes == null ? 0 : parseInt(exception.quantity.minutes))
                });
                break;
            case "After Quantity in Range":
                options.push({
                    Order: i,
                    BasePayrollRateId: exception.baseRate.Id,
                    AlternatePayrollRateId: exception.alternateRate.Id,
                    Type: 'count',
                    CountScope: 'total',
                    CountMinute: (exception.quantity.hours == null ? 0 : parseInt(exception.quantity.hours) * 60) +
                        (exception.quantity.minutes == null ? 0 : parseInt(exception.quantity.minutes))
                });
                break;
            case "Punches on Date":
                options.push({
                    Order: i,
                    BasePayrollRateId: exception.baseRate.Id,
                    AlternatePayrollRateId: exception.alternateRate.Id,
                    Type: 'date',
                    Date: moment(exception.date).format("YYYY-MM-DD")
                });
                break;
            }
        }
        console.log(options);
        // $uibModalInstance.close()
    };

    $scope.refreshBaseRates();
    $scope.refreshTasks();
});
