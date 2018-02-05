app.controller('FiltersController', function ($scope, $uibModalInstance, filters) {
    $scope.filters = filters
    $scope.loading = { customers: false, jobs: false, tasks: false }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }

    $scope.ok = function () {
        console.log($scope.filters)
        $uibModalInstance.close($scope.filters);
    }

    $scope.refreshCustomers = function () {
        $scope.customers = []
        $scope.loading.customers = true
        db.collection('customers').find().sort({ number: 1 }).execute()
            .then(docs => {
                $scope.loading.customers = false
                $scope.customers = docs
                $scope.$apply()
                $scope.refreshJobs()
            }).catch(err => {
                $scope.loading.customers = false
                console.error(err)
            })
    }

    $scope.refreshJobs = function () {
        if (!$scope.filters['customer'].customer_id) {
            return;
        }

        $scope.jobs = []
        $scope.tasks = []
        $scope.loading.jobs = true
        db.collection('jobs').find({ customer_id: $scope.filters['customer'].customer_id._id }).sort({ number: 1 }).execute()
            .then(docs => {
                $scope.loading.jobs = false
                $scope.jobs = docs
                $scope.$apply()
                $scope.refreshTasks()
            }).catch(err => {
                $scope.loading.jobs = false
                console.error(err)
            })
    }

    $scope.refreshTasks = function () {
        if (!$scope.filters['job'].job_id) {
            return;
        }

        $scope.tasks = []
        $scope.loading.tasks = true
        db.collection('tasks').find({ job_id: $scope.filters['job'].job_id._id }).sort({ number: 1 }).execute()
            .then(docs => {
                $scope.loading.tasks = false
                $scope.tasks = docs
                $scope.$apply()
            }).catch(err => {
                $scope.loading.tasks = false
                console.error(err)
            })
    }

    $scope.refreshUsers = function () {
        console.log($scope.filters.user.users)
        $scope.users = []
        $scope.loading.users = true
        db.collection('users').find().sort({ name: 1 }).execute()
            .then(docs => {
                $scope.loading.users = false
                $scope.users = docs
                $scope.$apply()
            }).catch(err => {
                $scope.loading.users = false
                console.error(err)
            })
    }

    $scope.refreshUsers()
    $scope.refreshCustomers()
});
