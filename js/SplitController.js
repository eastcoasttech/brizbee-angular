app.controller('SplitController', function ($http, $rootScope, $scope, $uibModalInstance) {
    $scope.split = {
        hstep: 1,
        inAtFormatted: moment($rootScope.range.InAt).format("dddd, MMMM DD, YYYY"),
        ismeridian: true,
        minutes: 2400,
        mstep: 15,
        outAtFormatted: moment($rootScope.range.OutAt).format("dddd, MMMM DD, YYYY"),
        time: moment().startOf('day').add('17', 'h').toDate(),
        type: 'minutes'
    };
    $scope.working = { save: false };

    $scope.ok = function () {
        $scope.working.save = true;
        if (confirm("Are you sure you want to split the punches between " + $scope.split.inAtFormatted + " and " + $scope.split.outAtFormatted + "? This process cannot be reverted.")) {
            var json = {
                InAt: $rootScope.range.InAt,
                Minutes: $scope.split.minutes.toString(),
                OutAt: $rootScope.range.OutAt,
                Time: moment($scope.split.time).format("H:mm"),
                Type: $scope.split.type
            };
            $http.post($rootScope.baseUrl + "odata/Punches/Default.Split", JSON.stringify(json))
                .then(response => {
                    $uibModalInstance.close('Success');
                }, error => {
                    $scope.working.save = false;
                    // do something
                });
        }
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.showDatepicker = function () {
        $scope.datepicker.opened = true;
    };
});