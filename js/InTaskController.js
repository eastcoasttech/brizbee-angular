app.controller('InTaskController', function ($http, $location, $rootScope, $scope, $window) {
    $scope.errors = {}
    $scope.task = {}
    $scope.working = {}

    $scope.searchTasks = function () {
        $scope.working.search = true
        $http.get($rootScope.baseUrl + "odata/Tasks?$filter=Number eq '" + $scope.task.Number + "'")
            .then(response => {
                if (response.data.value.length == 0) {
                    $scope.errors.task_number_not_found = true;
                } else {
                    $rootScope.selected.task = response.data.value[0]
                    $location.path('/in/confirm')
                }
            }, error => {
                $scope.working.search = false
                console.error(error)
            })
    };

    // Focus on task number input and scroll to top
    $window.document.getElementById("task_number").focus()
    $window.scrollTo(0, 0)
    

    // Disable mousewheel on a input number field when in focus
    // (to prevent Cromium browsers change the value when scrolling)
    $(':input[type=number]').on('mousewheel',function(e){ $(this).blur(); });

    $("input.form-control-number").numeric();
});
