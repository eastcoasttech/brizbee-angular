app.controller('CustomerDetailsController', function ($rootScope, $scope, $uibModalInstance, $window, customer) {
    if (customer._id == null) {
        $scope.customer = {}
    } else {
        $scope.customer = customer
    }
    $scope.working = { save: false }
    
    $scope.save = function () {
        if (customer._id == null) {
            $scope.saveNewCustomer()
        } else {
            $scope.saveExistingCustomer()
        }
    }

    $scope.saveExistingCustomer = function () {
        var customer = {
            name: $scope.customer.name,
            number: $scope.customer.number
        }

        db.collection('customers').updateOne({ _id: $scope.customer._id }, { $set: customer })
            .then(result => {
                $scope.ok()
            })
            .catch(error => {
                console.error(error)
            })
    }

    $scope.saveNewCustomer = function () {
        var customer = {
            owner_id: client.authedId(),
            organization_id: $rootScope.current.user.organization_id,
            name: $scope.customer.name,
            number: $scope.customer.number,
            created_at: new Date()
        }

        db.collection('customers').insertOne(customer)
            .then(result => {
                $scope.ok()
            })
            .catch(error => {
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
