app.controller('JobsController', function ($http, $rootScope, $scope, $uibModal, $window) {
    $scope.customers = []
    $scope.jobs = []
    $scope.loading = { customers: false, jobs: false, tasks: false }
    // $scope.new = { customer: {}, job: {}, task: {} }
    $scope.selected = {}
    $scope.tasks = []

    $scope.refreshCustomers = function () {
        $scope.customers = []
        $scope.loading.customers = true
        $http.get($rootScope.baseUrl + "odata/Customers?$orderby=Id")
            .then(response => {
                $scope.loading.customers = false
                $scope.customers = response.data.value
            }, error => {
                $scope.loading.customers = false
                console.error(error)
            })
    };

    $scope.refreshJobs = function () {
        if ($scope.selected.customer == null)
        {
            return;
        }

        $scope.jobs = []
        $scope.tasks = []
        $scope.loading.jobs = true
        $http.get($rootScope.baseUrl + "odata/Jobs?$orderby=Id&$filter=CustomerId eq " + $scope.selected.customer.Id)
            .then(response => {
                $scope.loading.jobs = false
                $scope.jobs = response.data.value
            }, error => {
                $scope.loading.jobs = false
                console.error(error)
            })
    };

    $scope.refreshTasks = function () {
        if ($scope.selected.job == null) {
            return;
        }

        $scope.tasks = []
        $scope.loading.tasks = true
        $http.get($rootScope.baseUrl + "odata/Tasks?$orderby=Id&$filter=JobId eq " + $scope.selected.job.Id)
            .then(response => {
                $scope.loading.tasks = false
                $scope.tasks = response.data.value
            }, error => {
                $scope.loading.tasks = false
                console.error(error)
            })
    };
    
    // $scope.saveJob = function () {
    //     db.collection('jobs').insertOne({
    //         owner_id: client.authedId(),
    //         organization_id: $rootScope.current.user.organization_id,
    //         name: $scope.new.job.name,
    //         number: $scope.new.job.number,
    //         customer_id: $scope.selected.customer._id,
    //         customer_number: $scope.selected.customer.number,
    //         customer_name: $scope.selected.customer.name,
    //         created_at: new Date()
    //     })
    //         .then(function (result) {
    //             console.log(result)
    //             $scope.new.job = {}
    //             $scope.refreshJobs()
    //         })
    // };

    // $scope.saveTask = function () {
    //     db.collection('tasks').insertOne({
    //         owner_id: client.authedId(),
    //         organization_id: $rootScope.current.user.organization_id,
    //         name: $scope.new.task.name,
    //         number: $scope.new.task.number,
    //         job_id: $scope.selected.job._id,
    //         job_number: $scope.selected.job.number,
    //         job_name: $scope.selected.job.name,
    //         created_at: new Date()
    //     })
    //         .then(function (result) {
    //             console.log(result)
    //             $scope.new.task = {}
    //             $scope.refreshTasks()
    //         })
    // };

    $scope.selectCustomer = function (customer) {
        $scope.selected.customer = customer;
        delete $scope.selected.job
        delete $scope.selected.task
        $scope.refreshJobs();
    };

    $scope.selectJob = function (job) {
        $scope.selected.job = job;
        delete $scope.selected.task
        $scope.refreshTasks();
    };

    $scope.selectTask = function (task) {
        $scope.selected.task = task;
    };

    $scope.showEditCustomer = function (customer) {
        if (!$scope.selected.customer || ($scope.selected.customer._id != customer._id)) {
            $scope.selectCustomer(customer)
        }

        var instance = $uibModal.open({
            templateUrl: '/pages/details/customer.html',
            controller: 'CustomerDetailsController',
            resolve: {
                customer: function () {
                    return customer;
                }
            }
        });

        instance.result
            .then((msg) => {
                console.log(msg)
                $scope.refreshCustomers()
            }, () => {
                console.log('dismissed')
            })
    }

    $scope.showEditJob = function (job) {
        if (!$scope.selected.job || ($scope.selected.job._id != job._id)) {
            $scope.selectJob(job)
        }

        var instance = $uibModal.open({
            templateUrl: '/pages/details/job.html',
            controller: 'JobDetailsController',
            resolve: {
                job: function () {
                    return job;
                }
            }
        });

        instance.result
            .then((msg) => {
                console.log(msg)
                $scope.refreshJobs()
            }, () => {
                console.log('dismissed')
            })
    }

    $scope.showEditTask = function (task) {
        if (!$scope.selected.task || ($scope.selected.task._id != task._id)) {
            $scope.selectTask(task)
        }

        var instance = $uibModal.open({
            templateUrl: '/pages/details/task.html',
            controller: 'TaskDetailsController',
            resolve: {
                task: function () {
                    return task;
                }
            }
        });

        instance.result
            .then((msg) => {
                console.log(msg)
                $scope.refreshTasks()
            }, () => {
                console.log('dismissed')
            })
    }

    $scope.showNewCustomer = function () {
        var instance = $uibModal.open({
            templateUrl: '/pages/details/customer.html',
            controller: 'CustomerDetailsController',
            resolve: {
                customer: function () {
                    return {};
                }
            }
        });

        instance.result
        .then((msg) => {
            console.log(msg)
            $scope.refreshCustomers()
        }, () => {
            console.log('dismissed')
        });
    };

    $scope.showNewJob = function () {
        var instance = $uibModal.open({
            templateUrl: '/pages/details/job.html',
            controller: 'JobDetailsController',
            resolve: {
                job: function () {
                    return {};
                }
            }
        });

        instance.result
        .then((msg) => {
            console.log(msg)
            $scope.refreshJobs()
        }, () => {
            console.log('dismissed')
        });
    };

    $scope.showNewTask = function () {
        var instance = $uibModal.open({
            templateUrl: '/pages/details/task.html',
            controller: 'TaskDetailsController',
            resolve: {
                task: function () {
                    return {};
                }
            }
        });

        instance.result
        .then((msg) => {
            console.log(msg)
            $scope.refreshTasks()
        }, () => {
            console.log('dismissed')
        });
    };

    $scope.refreshCustomers()
    
    // Scroll to top
    $window.scrollTo(0, 0)
});
