app.controller('JobsController', function ($http, $rootScope, $scope, $uibModal, $window) {
    $scope.customers = []
    $scope.customersPageStart = 0
    $scope.jobs = []
    $scope.jobsPageStart = 0
    $scope.loading = { customers: false, jobs: false, tasks: false }
    $scope.selected = {}
    $scope.tasks = []
    $scope.tasksPageStart = 0

    $scope.customersEnd = function () {
        return $scope.customersPageStart + 20 < $scope.customersCount ? $scope.customersPageStart + 20 : $scope.customersCount;
    };

    $scope.customersNext = function () {
        $scope.customersPageStart = $scope.customersPageStart + 20
        $scope.refreshCustomers()
    }
    
    $scope.customersPrevious = function () {
        $scope.customersPageStart = $scope.customersPageStart - 20
        $scope.refreshCustomers()
    }

    $scope.customersStart = function () {
        return $scope.customersPageStart + 1
    }
    
    $scope.jobsEnd = function () {
        return $scope.jobsPageStart + 20 < $scope.jobsCount ? $scope.jobsPageStart + 20 : $scope.jobsCount;
    };

    $scope.jobsNext = function () {
        $scope.jobsPageStart = $scope.jobsPageStart + 20
        $scope.refreshJobs()
    }
    
    $scope.jobsPrevious = function () {
        $scope.jobsPageStart = $scope.jobsPageStart - 20
        $scope.refreshJobs()
    }

    $scope.jobsStart = function () {
        return $scope.jobsPageStart + 1
    }

    
    $scope.tasksEnd = function () {
        return $scope.tasksPageStart + 20 < $scope.tasksCount ? $scope.tasksPageStart + 20 : $scope.tasksCount;
    };

    $scope.tasksNext = function () {
        $scope.tasksPageStart = $scope.tasksPageStart + 20
        $scope.refreshTasks()
    }
    
    $scope.tasksPrevious = function () {
        $scope.tasksPageStart = $scope.tasksPageStart - 20
        $scope.refreshTasks()
    }

    $scope.tasksStart = function () {
        return $scope.tasksPageStart + 1
    }

    $scope.refreshCustomers = function () {
        $scope.customers = []
        $scope.loading.customers = true
        $http.get($rootScope.baseUrl + "odata/Customers?$count=true&$orderby=Number&$top=20&$skip=" + $scope.customersPageStart)
            .then(response => {
                $scope.loading.customers = false
                $scope.customersCount = response.data["@odata.count"]
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
        $http.get($rootScope.baseUrl + "odata/Jobs?$count=true&$orderby=Number&$filter=CustomerId eq " + $scope.selected.customer.Id + "&$top=20&$skip=" + $scope.jobsPageStart)
            .then(response => {
                $scope.loading.jobs = false
                $scope.jobsCount = response.data["@odata.count"]
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
        $http.get($rootScope.baseUrl + "odata/Tasks?$count=true&$orderby=Number&$filter=JobId eq " + $scope.selected.job.Id + "&$top=20&$skip=" + $scope.tasksPageStart)
            .then(response => {
                $scope.loading.tasks = false
                $scope.tasksCount = response.data["@odata.count"]
                $scope.tasks = response.data.value
            }, error => {
                $scope.loading.tasks = false
                console.error(error)
            })
    };
    
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
        })

        instance.opened
            .then(() => {
                // Allow numbers only
                $("input.form-control-number").numeric()
            })

        instance.result
            .then((deleted) => {
                if (deleted) {
                    delete $scope.selected.customer
                    $scope.jobs = []
                    $scope.tasks = []
                }
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
                customer: function () {
                    return $scope.selected.customer;
                },
                job: function () {
                    return job;
                }
            }
        })

        instance.opened
            .then(() => {
                // Allow numbers only
                $("input.form-control-number").numeric()
            })

        instance.result
            .then((deleted) => {
                if (deleted) {
                    delete $scope.selected.job
                    $scope.tasks = []
                }
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
                job: function () {
                    return $scope.selected.job;
                },
                task: function () {
                    return task;
                }
            }
        })

        instance.opened
            .then(() => {
                // Allow numbers only
                $("input.form-control-number").numeric()
            })

        instance.result
            .then((deleted) => {
                if (deleted) {
                    delete $scope.selected.task
                }
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
        })

        instance.opened
            .then(() => {
                // Allow numbers only
                $("input.form-control-number").numeric()
            })

        instance.result
            .then((deleted) => {
                $scope.refreshCustomers()
            }, () => {
                console.log('dismissed')
            })
    };

    $scope.showNewJob = function () {
        var instance = $uibModal.open({
            templateUrl: '/pages/details/job.html',
            controller: 'JobDetailsController',
            resolve: {
                customer: function () {
                    return $scope.selected.customer;
                },
                job: function () {
                    return {};
                }
            }
        })

        instance.opened
            .then(() => {
                // Allow numbers only
                $("input.form-control-number").numeric()
            })

        instance.result
            .then((deleted) => {
                $scope.refreshJobs()
            }, () => {
                console.log('dismissed')
            })
    };

    $scope.showNewTask = function () {
        var instance = $uibModal.open({
            templateUrl: '/pages/details/task.html',
            controller: 'TaskDetailsController',
            resolve: {
                job: function () {
                    return $scope.selected.job;
                },
                task: function () {
                    return {};
                }
            }
        })

        instance.opened
            .then(() => {
                // Allow numbers only
                $("input.form-control-number").numeric()
            })

        instance.result
            .then((deleted) => {
                $scope.refreshTasks()
            }, () => {
                console.log('dismissed')
            })
    };

    $scope.refreshCustomers()
    
    // Scroll to top
    $window.scrollTo(0, 0)
});
