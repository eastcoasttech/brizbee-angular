app.controller('InTaskController', function ($location, $rootScope, $scope, $window) {
    $scope.task = {}
    $scope.working = {}

    $scope.searchTasks = function () {
        $scope.working.search = true
        db.collection('tasks').find({ number: $scope.task.number }).limit(1).execute()
            .then(tasks => {
                console.log(tasks)
                if (tasks.length > 0) {
                    $rootScope.selected.task = tasks[0]
                    $location.path('/in/confirm')
                    $scope.$apply()
                } else {
                    $scope.working.search = false
                    console.error('No job found')
                }
            }).catch(err => {
                $scope.working.search = false
                console.error(err)
            })
    };

    // Focus on task number input and scroll to top
    $window.document.getElementById("task_number").focus()
    $window.scrollTo(0, 0)
});
