app.controller('InTaskController', function ($http, $location, $rootScope, $scope, $window) {
    $scope.task = {}
    $scope.working = {}

    $scope.searchTasks = function () {
        $scope.working.search = true
        $http.get($rootScope.baseUrl + "odata/Tasks(" + $scope.task.Id + ")")
            .then(response => {
                $rootScope.selected.task = response.data
                $location.path('/in/confirm')
            }, error => {
                $scope.working.search = false
                console.error(error)
            })
    };

    // Focus on task number input and scroll to top
    $window.document.getElementById("task_id").focus()
    $window.scrollTo(0, 0)
});
