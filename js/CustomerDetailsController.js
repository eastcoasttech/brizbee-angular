app.controller('CustomerDetailsController', function ($http, $rootScope, $scope, $uibModalInstance, $window, customer) {
    if (customer.Id == null) {
        $scope.customer = {}
    } else {
        $scope.customer = customer
    }
    $scope.working = { save: false }

    $scope.delete = function () {
        $http.delete($rootScope.baseUrl + "odata/Customers(" + $scope.customer.Id + ")")
            .then(response => {
                $scope.ok()
            }, error => {
                console.error(error)
            })
    }
    
    $scope.save = function () {
        if (customer.Id == null) {
            $scope.saveNewCustomer()
        } else {
            $scope.saveExistingCustomer()
        }
    }

    $scope.saveExistingCustomer = function () {
        var json = {
            Name: $scope.customer.Name
        }

        $http.put($rootScope.baseUrl + "odata/Customers(" + $scope.customer.Id + ")", JSON.stringify(json))
            .then(response => {
                $scope.ok()
            }, error => {
                console.error(error)
            })
    }

    $scope.saveNewCustomer = function () {
        var json = {
            Name: $scope.customer.Name
        }

        $http.post($rootScope.baseUrl + "odata/Customers", JSON.stringify(json))
            .then(response => {
                $scope.ok()
            }, error => {
                console.error(error)
            })
    }
    
    $scope.ok = function () {
        $uibModalInstance.close('Success');
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }
});
