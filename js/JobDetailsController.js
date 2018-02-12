app.controller('JobDetailsController', function ($http, $rootScope, $scope, $uibModalInstance, $window, customer, job) {
    $scope.loading = { templates: false }
    if (job.Id == null) {
        $scope.job = {}
    } else {
        $scope.job = job
    }
    $scope.working = { save: false }
    
    $scope.delete = function () {
        if (confirm("Are you sure you want to delete this job and all it's tasks?")) {
            $http.delete($rootScope.baseUrl + "odata/Jobs(" + $scope.job.Id + ")")
                .then(response => {
                    $scope.ok(true)
                }, error => {
                    console.error(error)
                })
        }
    }

    $scope.save = function () {
        if (job.Id == null) {
            $scope.saveNewJob()
        } else {
            $scope.saveExistingJob()
        }
    }

    $scope.saveExistingJob = function () {
        var json = {
            Name: $scope.job.Name
        }

        $http.put($rootScope.baseUrl + "odata/Jobs(" + $scope.job.Id + ")", JSON.stringify(json))
            .then(response => {
                $scope.ok(false)
            }, error => {
                console.error(error)
            })
    }

    $scope.saveNewJob = function () {
        var json = {
            CustomerId: customer.Id,
            Name: $scope.job.Name
        }

        $http.post($rootScope.baseUrl + "odata/Jobs", JSON.stringify(json))
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

    // $scope.refreshTemplates = function () {
    //     if (!$scope.job._id) {
    //         return;
    //     }

    //     $scope.templates = []
    //     $scope.loading.templates = true
    //     db.collection('templates').find({ organization_id: $rootScope.current.user.organization_id }).sort({ name: 1 }).execute()
    //         .then(docs => {
    //             $scope.loading.templates = false
    //             $scope.templates = docs
    //             $scope.$apply()
    //         }).catch(err => {
    //             $scope.loading.templates = false
    //             console.error(err)
    //         })
    // }

    // $scope.refreshTemplates()
});
