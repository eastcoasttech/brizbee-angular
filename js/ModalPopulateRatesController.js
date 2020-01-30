app.controller('ModalPopulateRatesController', function ($http, $rootScope, $scope, $uibModalInstance) {
    $scope.exceptions = []
    $scope.timepicker = { hstep: 1, mstep: 1 }

    $scope.addException = function () {
        $scope.exceptions.push({ option: 'Punches Before', time: moment().startOf('day').add('17', 'h').toDate(), baseRate: $scope.baseRates[0] })

        // Allow numbers only, must be applied every time
        $("input.form-control-number").numeric()
    }

    $scope.removeException = function (idx) {
        $scope.exceptions.splice(idx, 1)
    }

    $scope.refreshBaseRates = function () {
        $http.get($rootScope.baseUrl + "/odata/Rates?$orderby=Name&$filter=ParentRateId eq null")
            .then(response => {
                $scope.baseRates = response.data.value
                
                // Add first exception and select first base rate
                var exception = { option: 'Punches Before', time: moment().startOf('day').add('17', 'h').toDate(), baseRate: $scope.baseRates[0] }
                $scope.exceptions.push(exception)
                $scope.refreshAlternateRates(exception)
            }, error => {
                console.error(error)
            })
    }

    $scope.refreshAlternateRates = function (exception) {
        $http.get($rootScope.baseUrl + "/odata/Rates?$orderby=Name&$filter=ParentRateId eq " + exception.baseRate.Id)
            .then(response => {
                exception.alternateRates = response.data.value

                // Select the first alternate rate
                exception.alternateRate = exception.alternateRates[0]
            }, error => {
                console.error(error)
            })
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss()
    }

    $scope.ok = function () {
        $uibModalInstance.close()
    }

    $scope.refreshBaseRates();
})
