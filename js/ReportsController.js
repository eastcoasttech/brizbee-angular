app.controller('ReportsController', function ($http, $rootScope, $scope, $window) {
    $scope.datepicker = { in_at: {}, out_at: {}, options: {} }
    $scope.include = { jobs: { list: [], scope: 'all', search: '' }, users: { list: [], scope: 'all', search: '' } }

    $scope.addUser = function (user) {
        $scope.include.users.list.push(user)
    }
    
    $scope.removeUser = function (user) {
        $scope.include.users.list.pop(user)
    }

    $scope.searchJobs = function () {

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
