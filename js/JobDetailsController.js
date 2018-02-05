app.controller('JobDetailsController', function ($rootScope, $scope, $uibModalInstance, $window, job) {
    $scope.loading = { templates: false }
    if (job._id == null) {
        $scope.job = {}
    } else {
        $scope.job = job
    }
    $scope.working = { save: false }
    
    $scope.save = function () {
        if (job._id == null) {
            $scope.saveNewJob()
        } else {
            $scope.saveExistingJob()
        }
    }

    $scope.saveExistingJob = function () {
        var job = {
            name: $scope.job.name,
            number: $scope.job.number
        }

        db.collection('jobs').updateOne({ _id: $scope.job._id }, { $set: job })
            .then(result => {
                $scope.ok()
            })
            .catch(error => {
                console.error(error)
            })
    }

    $scope.saveNewJob = function () {
        var job = {
            owner_id: client.authedId(),
            organization_id: $rootScope.current.user.organization_id,
            name: $scope.job.name,
            number: $scope.job.number,
            created_at: new Date()
        }

        db.collection('jobs').insertOne(job)
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

    $scope.refreshTemplates = function () {
        if (!$scope.job._id) {
            return;
        }

        $scope.templates = []
        $scope.loading.templates = true
        db.collection('templates').find({ organization_id: $rootScope.current.user.organization_id }).sort({ name: 1 }).execute()
            .then(docs => {
                $scope.loading.templates = false
                $scope.templates = docs
                $scope.$apply()
            }).catch(err => {
                $scope.loading.templates = false
                console.error(err)
            })
    }

    $scope.refreshTemplates()
});
