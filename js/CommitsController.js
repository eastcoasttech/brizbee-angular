app.controller('CommitsController', function ($http, $rootScope, $scope, $uibModal, $window) {
    $scope.commits = []
    $scope.loading = { commits: false }
    $scope.sortDirection = 'asc'
    $scope.sortType = 'InAt'
    $scope.working = { commit: false }

    // Reset the document title, in case the session expired
    $(document).prop('title', 'Dashboard - BRIZBEE')

    $scope.refreshCommits = function () {
        $scope.commits = []
        $scope.loading.commits = true
        $http.get($rootScope.baseUrl + "/odata/Commits?$orderby=InAt desc&$expand=User")
            .then(response => {
                $scope.loading.commits = false
                $scope.commits = response.data.value
            }, error => {
                $scope.loading.commits = false
                console.error(error)
            })
    }

    $scope.setSortType = function (sortType) {
        $scope.sortType = sortType
        if ($scope.sortDirection == 'asc') {
            $scope.sortDirection = 'desc'
        } else {
            $scope.sortDirection = 'asc'
        }
        $scope.refreshPunches()
    }

    $scope.showNewCommit = function () {
        var instance = $uibModal.open({
            templateUrl: '/pages/details/commit.html',
            controller: 'CommitDetailsController',
            resolve: {
                commit: function () {
                    return {};
                }
            }
        });

        instance.result
            .then((msg) => {
                console.log(msg)
                $scope.refreshCommits()
            }, () => {
                // dismissed
            })
    }
    
    $scope.showExport = function (commit_id) {
        var instance = $uibModal.open({
            templateUrl: '/pages/modals/export.html',
            controller: 'ModalExportController',
            resolve: {
                commit_id: function () {
                    return commit_id
                }
            }
        });
        
        instance.result
            .then(() => {
                // success
            }, () => {
                // dismissed
            })
    }

    $scope.undo = function (commit) {
        if (confirm("Are you sure you want to undo this commit? All the punches will be editable again?")) {

            $http.post($rootScope.baseUrl + "/odata/Commits(" + commit.Id + ")/Default.Undo")
                .then(response => {
                    // Refresh the commits
                    $scope.refreshCommits()
                    $scope.working.commit = false
                    alert('The commit has been successfully reversed.')
                }, error => {
                    console.error(error)
                })
        }
    }

    $scope.refreshCommits()

    // Scroll to top
    $window.scrollTo(0, 0)
});
