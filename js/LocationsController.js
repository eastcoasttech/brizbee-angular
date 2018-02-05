app.controller('LocationsController', function ($rootScope, $scope, $uibModal, $window) {
    $scope.locations = []
    $scope.loading = { locations: false }

    $scope.refreshLocations = function () {
        $scope.locations = []
        $scope.loading.locations = true
        db.collection('locations').find().sort({ number: 1 }).execute()
            .then(docs => {
                $scope.loading.locations = false
                $scope.locations = docs
                $scope.$apply()
            }).catch(err => {
                $scope.loading.locations = false
                console.error(err)
            })
    };

    $scope.showNewLocation = function () {
        var instance = $uibModal.open({
            templateUrl: '/pages/details/location.html',
            controller: 'LocationDetailsController',
            resolve: {
                location: function () {
                    return {};
                }
            }
        });

        instance.result
        .then((msg) => {
            console.log(msg)
            $scope.refreshLocations()
        }, () => {
            console.log('dismissed')
        });
    };

    $scope.refreshLocations()

    // Scroll to top
    $window.scrollTo(0, 0)
});
