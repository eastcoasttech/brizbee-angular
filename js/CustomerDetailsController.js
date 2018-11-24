app.controller('CustomerDetailsController', function ($http, $rootScope, $scope, $uibModalInstance, $window, customer) {
    if (customer.Id == null) {
        $scope.customer = {}
    } else {
        $scope.customer = customer
    }
    $scope.working = { save: false }

    $scope.delete = function () {
        if (confirm("Are you sure you want to delete this customer?")) {
            $http.delete($rootScope.baseUrl + "/odata/Customers(" + $scope.customer.Id + ")")
                .then(response => {
                    $scope.ok(true)
                }, error => {
                    console.error(error)
                })
        }
    }
    
    $scope.nextNumber = function () {
        $http.post($rootScope.baseUrl + '/odata/Customers/Default.NextNumber')
            .then(response => {
                $scope.customer.Number = response.data.value
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
            Name: $scope.customer.Name,
            Number: $scope.customer.Number
        }

        $http.patch($rootScope.baseUrl + "/odata/Customers(" + $scope.customer.Id + ")", JSON.stringify(json))
            .then(response => {
                $scope.ok(false)
            }, error => {
                console.error(error)
            })
    }

    $scope.saveNewCustomer = function () {
        var json = {
            Name: $scope.customer.Name,
            Number: $scope.customer.Number
        }

        $http.post($rootScope.baseUrl + "/odata/Customers", JSON.stringify(json))
            .then(response => {
                $scope.ok(false)
            }, error => {
                console.error(error)
            })
    }
    
    $scope.ok = function (deleted) {
        $uibModalInstance.close(deleted);
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }

    if (customer.Id == null) {
        $scope.nextNumber()
    }
});
