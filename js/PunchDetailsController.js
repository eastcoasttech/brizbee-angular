app.controller('PunchDetailsController', function ($filter, $rootScope, $scope, $uibModalInstance, punch) {
    $scope.customers = []
    $scope.datepicker = { in_at: {}, out_at: {}, options: {} }
    $scope.jobs = []
    $scope.loading = { customers: false, jobs: false, tasks: false }
    if (punch._id == null) {
        $scope.punch = {
            in_at: moment().startOf('day').toDate(),
            out_at: moment().endOf('day').toDate(),
            has_out_at: true
        }
    } else {
        $scope.punch = punch
        if ($scope.punch.out_at != null) {
            $scope.punch.has_out_at = true
        }
    }
    $scope.working = { save: false }

    $scope.save = function () {
        if (punch._id == null) {
            $scope.saveNewPunch()
        } else {
            $scope.saveExistingPunch()
        }
    };

    $scope.saveNewPunch = function () {
        var punch = {
            owner_id: client.authedId(),
            organization_id: $rootScope.current.user.organization_id,
            in_at: $scope.punch.in_at,
            customer_id: $scope.punch.customer._id,
            customer_name: $scope.punch.customer.name,
            customer_number: $scope.punch.customer.number,
            job_id: $scope.punch.job._id,
            job_name: $scope.punch.job.name,
            job_number: $scope.punch.job.number,
            task_id: $scope.punch.task._id,
            task_name: $scope.punch.task.name,
            task_number: $scope.punch.task.number,
            user_id: $scope.punch.user._id,
            user_name: $scope.punch.user.name
        }

        // out_at is optional when editing manually
        if ($scope.punch.has_out_at) {
            punch.out_at = $scope.punch.out_at
        }

        db.collection('punches').insertOne(punch)
            .then(result => {
                $scope.ok()
            })
            .catch(error => {
                console.error(error)
            })
    };

    $scope.saveExistingPunch = function () {
        var punch = {
            in_at: $scope.punch.in_at,
            customer_id: $scope.punch.customer._id,
            customer_name: $scope.punch.customer.name,
            customer_number: $scope.punch.customer.number,
            job_id: $scope.punch.job._id,
            job_name: $scope.punch.job.name,
            job_number: $scope.punch.job.number,
            task_id: $scope.punch.task._id,
            task_name: $scope.punch.task.name,
            task_number: $scope.punch.task.number,
            user_id: $scope.punch.user._id,
            user_name: $scope.punch.user.name
        }

        // out_at is optional when editing manually
        if ($scope.punch.has_out_at) {
            punch.out_at = $scope.punch.out_at
        } else {
            punch.out_at = null
        }

        db.collection('punches').updateOne({ _id: $scope.punch._id }, { $set: punch })
            .then(result => {
                $scope.ok()
            })
            .catch(error => {
                console.error(error)
            })
    };

    $scope.ok = function () {
        $uibModalInstance.close('Success');
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.refreshCustomers = function () {
        $scope.customers = []
        $scope.loading.customers = true
        db.collection('customers').find().sort({ number: 1 }).execute()
            .then(docs => {
                $scope.loading.customers = false
                $scope.customers = docs
                if (!$scope.punch.customer_id) {
                    $scope.punch.customer = $scope.customers[0]
                } else {
                    $scope.punch.customer = $filter('filter')($scope.customers, { _id: $scope.punch.customer_id }, true)[0]
                }
                $scope.$apply()
                $scope.refreshJobs()
            }).catch(err => {
                $scope.loading.customers = false
                console.error(err)
            })
    };

    $scope.refreshJobs = function () {
        if ($scope.punch.customer == null)
        {
            return;
        }

        $scope.jobs = []
        $scope.tasks = []
        $scope.loading.jobs = true
        db.collection('jobs').find({ customer_id: $scope.punch.customer._id }).sort({ number: 1 }).execute()
            .then(docs => {
                $scope.loading.jobs = false
                $scope.jobs = docs
                if (!$scope.punch.job_id) {
                    $scope.punch.job = $scope.jobs[0]
                } else {
                    $scope.punch.job = $filter('filter')($scope.jobs, { _id: $scope.punch.job_id }, true)[0]
                }
                $scope.$apply()
                $scope.refreshTasks()
            }).catch(err => {
                $scope.loading.jobs = false
                console.error(err)
            })
    };

    $scope.refreshTasks = function () {
        if ($scope.punch.job == null) {
            return;
        }

        $scope.tasks = []
        $scope.loading.tasks = true
        db.collection('tasks').find({ job_id: $scope.punch.job._id }).sort({ number: 1 }).execute()
            .then(docs => {
                $scope.loading.tasks = false
                $scope.tasks = docs
                if (!$scope.punch.task_id) {
                    $scope.punch.task = $scope.tasks[0]
                } else {
                    $scope.punch.task = $filter('filter')($scope.tasks, { _id: $scope.punch.task_id }, true)[0]
                }
                $scope.$apply()
            }).catch(err => {
                $scope.loading.tasks = false
                console.error(err)
            })
    };

    $scope.refreshUsers = function () {
        $scope.users = []
        $scope.loading.users = true
        db.collection('users').find().sort({ name: 1 }).execute()
            .then(docs => {
                $scope.loading.users = false
                $scope.users = docs
                if (!$scope.punch.user_id) {
                    $scope.punch.user = $scope.users[0]
                } else {
                    $scope.punch.user = $filter('filter')($scope.users, { _id: $scope.punch.user_id }, true)[0]
                }
                $scope.$apply()
            }).catch(err => {
                $scope.loading.users = false
                console.error(err)
            })
    };
    
    $scope.showInAtDatepicker = function () {
        $scope.datepicker.in_at.opened = true
    }

    $scope.showOutAtDatepicker = function () {
        $scope.datepicker.out_at.opened = true
    }

    $scope.refreshUsers()
    $scope.refreshCustomers()
});
