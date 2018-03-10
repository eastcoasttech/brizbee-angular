app.controller('InTaskController', function ($http, $location, $rootScope, $scope, $window) {
    $scope.task = {}
    $scope.working = {}

    $scope.searchTasks = function () {
        $scope.working.search = true
        $http.get($rootScope.baseUrl + "odata/Tasks?$filter=Number eq '" + $scope.task.Number + "'")
            .then(response => {
                $rootScope.selected.task = response.data.value[0]
                $location.path('/in/confirm')
            }, error => {
                $scope.working.search = false
                console.error(error)
            })
    };

    // Focus on task number input and scroll to top
    $window.document.getElementById("task_number").focus()
    $window.scrollTo(0, 0)
});
