app.controller('InTaskController', function ($http, $location, $rootScope, $scope, $window) {
    $scope.errors = {}
    $scope.task = {}
    $scope.working = {}

    $scope.searchTasks = function () {
        $scope.working.search = true
        $http.get($rootScope.baseUrl + "/odata/Tasks/Search(Number='" + $scope.task.Number + "')")
            .then(response => {
                if (response.data.length == 0) {
                    $scope.errors.task_number_not_found = true
                    $scope.working.search = false
                } else {
                    $rootScope.selected.task = response.data
                    $location.path('/in/confirm')
                }
            }, error => {
                $scope.working.search = false
                console.error(error)
            })
    }

    // Scroll to top
    $window.scrollTo(0, 0)

    // Allow numbers only
    $("input.form-control-number").numeric()
})
