app.controller('RateDetailsController', function ($http, $rootScope, $scope, $uibModalInstance, $window, rate) {
    if (rate.Id == null) {
        $scope.rate = { "Scope" : "Base", "Type" : "Payroll" };
    } else {
        $scope.rate = angular.copy(rate);
        if ($scope.rate.ParentRateId == null) {
            $scope.rate.Scope = "Base";
        } else {
            $scope.rate.Scope = "Alternate";
        }
    }
    $scope.working = { save: false };
    
    $scope.delete = function () {
        $scope.working.save = true
        
        if (confirm("Are you sure you want to delete this rate?")) {
            $http.delete($rootScope.baseUrl + "/odata/Rates(" + $scope.rate.Id + ")")
                .then(response => {
                    $scope.ok(true)
                }, error => {
                    $scope.working.save = false
                    console.error(error)
                })
        }
    };
    
    $scope.refreshRates = function () {
        $scope.rates = [];

        // Filter by type
        var filter_by_type = "";
        if ($scope.rate.Type == "Payroll") {
            filter_by_type = " and Type eq 'Payroll'";
        } else if ($scope.rate.Type == "Service") {
            filter_by_type = " and Type eq 'Service'";
        }

        $http.get($rootScope.baseUrl + "/odata/Rates?$orderby=Name&$filter=ParentRateId eq null" + filter_by_type)
            .then(response => {
                $scope.rates = response.data.value;
                $scope.rate.ParentRate = $scope.rates[0]; // Select first rate
            }, error => {
                console.error(error);
            });
    };
    $scope.refreshRates();

    $scope.save = function () {
        if (rate.Id == null) {
            $scope.saveNewRate()
        } else {
            $scope.saveExistingRate()
        }
    };

    $scope.saveExistingRate = function () {
        $scope.working.save = true

        var json = {
            Name: $scope.rate.Name,
            QBOPayrollItem: $scope.rate.QBOPayrollItem,
            QBOServiceItem: $scope.rate.QBOServiceItem,
            QBDPayrollItem: $scope.rate.QBDPayrollItem,
            QBDServiceItem: $scope.rate.QBDServiceItem
        }

        $http.patch($rootScope.baseUrl + "/odata/Rates(" + $scope.rate.Id + ")", JSON.stringify(json))
            .then(response => {
                $scope.ok(false)
            }, error => {
                $scope.working.save = false
                console.error(error)
            })
    };

    $scope.saveNewRate = function () {
        $scope.working.save = true

        var json = {
            Name: $scope.rate.Name,
            Type: $scope.rate.Type,
            QBOPayrollItem: $scope.rate.QBOPayrollItem,
            QBOServiceItem: $scope.rate.QBOServiceItem,
            QBDPayrollItem: $scope.rate.QBDPayrollItem,
            QBDServiceItem: $scope.rate.QBDServiceItem
        }

        // May be an alternate rate with a parent rate
        if ($scope.rate.Scope == "Alternate") {
            json.ParentRateId = $scope.rate.ParentRate.Id;
        }

        $http.post($rootScope.baseUrl + "/odata/Rates", JSON.stringify(json))
            .then(response => {
                $scope.ok(false)
            }, error => {
                $scope.working.save = false
                console.error(error)
            })
    };
    
    $scope.ok = function (deleted) {
        $uibModalInstance.close(deleted);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
