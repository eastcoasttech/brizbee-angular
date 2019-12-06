app.controller('MapController', function ($rootScope, $scope, $uibModalInstance, punch) {
    $scope.punch = punch

    console.log($scope.punch)
    console.log(parseFloat($scope.punch.LongitudeForInAt))
    console.log(parseFloat($scope.punch.LatitudeForInAt))


    var checkExist = setInterval(function() {
        if (document.getElementById('locationMap')) {
            var map = new Microsoft.Maps.Map('#locationMap', {
                center: new Microsoft.Maps.Location(parseFloat($scope.punch.LongitudeForInAt), parseFloat($scope.punch.LatitudeForInAt)),
                mapTypeId: Microsoft.Maps.MapTypeId.aerial,
                zoom: 10
            });
            clearInterval(checkExist);
        }
     }, 100); // check every 100ms

    $scope.ok = function () {
        $uibModalInstance.close('success');
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }
});
