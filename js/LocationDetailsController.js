app.controller('LocationDetailsController', function ($rootScope, $scope, $uibModalInstance, location) {
    if (location._id == null) {
        $scope.location = {}
    } else {
        $scope.location = location
    }
    $scope.working = { save: false }
    
    $scope.save = function () {
        if (location._id == null) {
            $scope.saveNewLocation()
        } else {
            $scope.saveExistingLocation()
        }
    }

    $scope.saveNewLocation = function () {
        var location = {
            owner_id: client.authedId(),
            organization_id: $rootScope.current.user.organization_id,
            name: $scope.location.name,
            number: $scope.location.number,
            created_at: new Date()
        }

        db.collection('locations').insertOne(location)
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
