app.controller('ExportFileController', function ($http, $location, $rootScope, $routeParams, $scope, $timeout, $window) {
    $scope.commits = []
    $scope.loading = { commits: false }
    $scope.step = {}

    $scope.cancel = function () {
        $scope.showWelcome()
    }

    $scope.next = function () {
        $scope.step = { name: 'commit', number: '2', title: 'Select Committed Punches' }
    }

    $scope.loadMoreCommits = function () {
        $scope.commits = []
        $scope.loading.commits = true
        var skip = 0
        if (skip > 0)
        {
            skip = skip + 3
        }
        $http.get($rootScope.baseUrl + "/odata/Commits?$orderby=InAt desc&$expand=User&$top=3&$skip=" + skip)
            .then(response => {
                $scope.loading.commits = false
                $scope.commits = _.merge($scope.commits, response.data.value)
            }, error => {
                $scope.loading.commits = false
                console.error(error)
            })
    }
    $scope.loadMoreCommits()

    $scope.showWelcome = function () {
        $scope.step = { name: 'welcome', number: '1', title: 'Get Started' }
    }
    $scope.showWelcome()

    // Scroll to top
    $window.scrollTo(0, 0)
})
