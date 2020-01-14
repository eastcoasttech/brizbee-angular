app.controller('CommitDetailsController', function ($filter, $http, $rootScope, $scope, $uibModalInstance, $uibModal, commit) {
    $scope.working = { commit: false }
    
    $scope.save = function () {
        $scope.working.commit = true

        var json = { InAt: moment($rootScope.range.InAt).format("YYYY-MM-DD"), OutAt: moment($rootScope.range.OutAt).format("YYYY-MM-DD") }
        $http.post($rootScope.baseUrl + "/odata/Commits", JSON.stringify(json))
            .then(response => {
                $scope.ok();
            }, error => {
                $scope.working.commit = false
                if (error.data.error.message)
                {
                    alert(error.data.error.message)
                }
                console.error(error)
            })
    }


    $scope.ok = function () {
        $uibModalInstance.close('Success')
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel')
    }
});
