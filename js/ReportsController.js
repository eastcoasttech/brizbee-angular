app.controller('ReportsController', function ($http, $rootScope, $scope, $window) {
    $scope.datepicker = { in_at: {}, out_at: {}, options: {} }
    $scope.include = {
        jobs: { list: [], scope: 'all', search: '' },
        users: { list: [], scope: 'all', search: '' },
        committed: 'all'
    }

    // Reset the document title, in case the session expired
    $(document).prop('title', 'Dashboard - BRIZBEE')

    $scope.addJob = function (job) {
        $scope.include.jobs.list.push(job)
        if ($scope.include.jobs.results.length == 1) {
            $scope.include.jobs.results = []
            $scope.include.jobs.search = ''
        } else {
            angular.forEach($scope.include.jobs.results, function (value, key) {
                if (job.Id == value.Id) {
                    $scope.include.jobs.results.splice(key, 1)
                }
            })
        }
    }

    $scope.addUser = function (user) {
        $scope.include.users.list.push(user)
        if ($scope.include.users.results.length == 1) {
            $scope.include.users.results = []
            $scope.include.users.search = ''
        } else {
            angular.forEach($scope.include.users.results, function (value, key) {
                if (user.Id == value.Id) {
                    $scope.include.users.results.splice(key, 1)
                }
            })
        }
    }

    $scope.includedJobIds = function () {
        var string = ""
        angular.forEach($scope.include.jobs.list, function (value, key) {
            string = string + "&JobIds=" + value.Id
        })
        return string
    }
    
    $scope.includedUserIds = function () {
        var string = ""
        angular.forEach($scope.include.users.list, function (value, key) {
            string = string + "&UserIds=" + value.Id
        })
        return string
    }
    
    $scope.removeJob = function (user) {
        angular.forEach($scope.include.jobs.list, function (value, key) {
            if (user.Id == value.Id) {
                $scope.include.jobs.list.splice(key, 1)
            }
        })
    }

    $scope.removeUser = function (user) {
        angular.forEach($scope.include.users.list, function (value, key) {
            if (user.Id == value.Id) {
                $scope.include.users.list.splice(key, 1)
            }
        })
    }

    $scope.searchJobs = function () {
        $scope.include.jobs.results = []
		var result = []

		if ($scope.include.jobs.search.length < 1) {
            console.error('No search value provided')
		} else {
			$http.get($rootScope.baseUrl + "/odata/Jobs?$filter=contains(Name,'" + $scope.include.jobs.search + "')&$select=Name,Number,Id")
                .then(function (response)
                {
                    if (response.data.value.length >= 1) {
                        $scope.include.jobs.results = response.data.value
                    }
                }, function(response)
                {
                    console.error(response)
                })
		}

		return result
    }
    
    $scope.searchUsers = function () {
        $scope.include.users.results = []
		var result = []

		if ($scope.include.users.search.length < 1) {
            console.error('No search value provided')
		} else {
			$http.get($rootScope.baseUrl + "/odata/Users?$filter=contains(Name,'" + $scope.include.users.search + "')&$select=EmailAddress,Name,Id")
                .then(function (response)
                {
                    if (response.data.value.length >= 1) {
                        $scope.include.users.results = response.data.value
                    }
                }, function(response)
                {
                    console.error(response)
                })
		}

		return result
    }

    $scope.showOutAtDatepicker = function () {
        $scope.datepicker.out_at.opened = true
    }

    $scope.showInAtDatepicker = function () {
        $scope.datepicker.in_at.opened = true
    }

    // Scroll to top
    $window.scrollTo(0, 0)
});
