app.controller('ModalSplitMidnightController', function ($http, $rootScope, $scope, $uibModalInstance) {
    $scope.split = {
        inAtFormatted: moment($rootScope.range.InAt).format("dddd, MMMM DD, YYYY"),
        outAtFormatted: moment($rootScope.range.OutAt).format("dddd, MMMM DD, YYYY")
    };
    $scope.working = { save: false }

    $scope.ok = function () {
        $scope.working.save = true;
        if (confirm("Are you sure you want to split the punches between " + $scope.split.inAtFormatted + " and " + $scope.split.outAtFormatted + " at midnight?")) {
            var json = {
                InAt: $scope.formatMomentFromDate($rootScope.range.InAt, 'YYYY-MM-DDTHH:mm:ss-00:00'),
                OutAt: $scope.formatMomentFromDate($rootScope.range.OutAt, 'YYYY-MM-DDTHH:mm:ss-00:00')
            }
            $http.post($rootScope.baseUrl + "/odata/Punches/Default.SplitAtMidnight", JSON.stringify(json))
                .then(response => {
                    $uibModalInstance.close()
                }, error => {
                    $scope.working.save = false
                });
        }
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss()
    };
});