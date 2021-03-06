app.controller('JobsController', function ($http, $rootScope, $scope, $uibModal, $window) {
    $scope.customers = []
    $scope.customersPageStart = 0
    $scope.jobs = []
    $scope.jobsPageStart = 0
    $scope.loading = { customers: false, jobs: false, tasks: false }
    $scope.selected = {}
    $scope.tasks = []
    $scope.tasksPageStart = 0

    // Reset the document title, in case the session expired
    $(document).prop('title', 'Dashboard - BRIZBEE')

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
        $http.get($rootScope.baseUrl + "/odata/Customers?$count=true&$orderby=Number&$top=20&$skip=" + $scope.customersPageStart)
            .then(response => {
                $scope.loading.customers = false
                $scope.customersCount = response.data["@odata.count"]
                $scope.customers = response.data.value
                
                $scope.selectCustomer($scope.customers[0])
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
        $http.get($rootScope.baseUrl + "/odata/Jobs?$count=true&$orderby=Number&$filter=CustomerId eq " + $scope.selected.customer.Id + "&$top=20&$skip=" + $scope.jobsPageStart)
            .then(response => {
                $scope.loading.jobs = false
                $scope.jobsCount = response.data["@odata.count"]
                $scope.jobs = response.data.value

                $scope.selectJob($scope.jobs[0])
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
        $http.get($rootScope.baseUrl + "/odata/Tasks?$count=true&$orderby=Number&$filter=JobId eq " + $scope.selected.job.Id + "&$top=20&$skip=" + $scope.tasksPageStart)
            .then(response => {
                $scope.loading.tasks = false
                $scope.tasksCount = response.data["@odata.count"]
                $scope.tasks = response.data.value

                $scope.selectTask($scope.tasks[0])
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

        instance.rendered
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

        instance.rendered
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

        instance.rendered
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

        instance.rendered
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

        instance.rendered
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

        instance.rendered
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

    // Instance the tour
    var tour = new Tour({
        steps: [
        {
            element: "#btn_new_customer",
            title: "Add a New Customer",
            content: "A customer is exactly what it sounds like - your individual customers - or your own business. Normally, you will create a Customer for each of your actual customers. However, you can also create a Customer to track time for tasks performed for your own business, like Internal, or to track time for employees doing work that you don't need to bill."
        }, {
            element: "#btn_new_job",
            title: "Add a Job for the Customer",
            content: "Jobs represent units of work for a Customer. For some customers, you will have multiple jobs every time you have a new project. However, if you need to track time for your own business or for general employment, you can create a job for that. Ex. Fabricate Widget or General"
        }, {
            element: "#btn_new_task",
            title: "Add Tasks for the Job",
            content: "Tasks let you track time for individual parts of a project or job. Ex. Welding, Assembly, Cleaning, or Sales"
        }, {
            element: "#btn_download",
            title: "Download Task Sheet",
            content: "Download this PDF and allow your employees to punch in by scanning the barcodes from the mobile apps."
        }, {
            element: "#lnk_punches",
            title: "See Punches and Time Cards",
            content: "When you're ready, go here to see how and when you employees punched in or added time cards."
        }, {
            element: "#lnk_reports",
            title: "Download Reports",
            content: "Go here to download PDF reports of your employees punches and time cards for a given range of time, and for a single customer or all customers."
        }, {
            element: "#lnk_users",
            title: "Add Additional Users",
            content: "Additional employees can always be added. Contact us if you need to upgrade your plan."
        }
    ]});
    
    // Initialize the tour
    tour.init();
    
    // Start the tour
    tour.start();
});
