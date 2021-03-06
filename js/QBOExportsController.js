app.controller('QBOExportsController', function ($http, $rootScope, $scope, $uibModal, $window) {
    $scope.exports = []
    $scope.loading = { exports: false }
    $scope.exportsPageStart = 0
    $scope.sortDirection = 'desc'
    $scope.sortType = 'CreatedAt'

    // Reset the document title, in case the session expired
    $(document).prop('title', 'Dashboard - BRIZBEE')

    $scope.setSortType = function (sortType) {
        $scope.sortType = sortType
        if ($scope.sortDirection == 'asc') {
            $scope.sortDirection = 'desc'
        } else {
            $scope.sortDirection = 'asc'
        }
        $scope.refreshExports()
    }

    $scope.exportsEnd = function () {
        return $scope.exportsPageStart + 20 < $scope.exportsCount ? $scope.exportsPageStart + 20 : $scope.exportsCount
    }

    $scope.exportsNext = function () {
        $scope.exportsPageStart = $scope.exportsPageStart + 20
        $scope.refreshExports()
    }
    
    $scope.exportsPrevious = function () {
        $scope.exportsPageStart = $scope.exportsPageStart - 20
        $scope.refreshExports()
    }

    $scope.exportsStart = function () {
        return $scope.exportsPageStart + 1
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
            .then((msg) => {
                console.log(msg)
            }, () => {
                // dismissed
            })
    }

    $scope.refreshExports = function () {
        $scope.exports = []
        $scope.loading.exports = true
        $http.get($rootScope.baseUrl + "/odata/QuickBooksOnlineExports?$count=true&$expand=Commit,CreatedByUser,ReversedByUser&$top=20&$skip=" + $scope.exportsPageStart + "&$orderby=" + $scope.sortType + " " + $scope.sortDirection)
            .then(response => {
                $scope.loading.exports = false
                $scope.exports = response.data.value
                $scope.exportsCount = response.data['@odata.count']
            }, error => {
                $scope.loading.exports = false
                console.error(error)
            })
    }

    $scope.refreshExports()

    // Scroll to top
    $window.scrollTo(0, 0)
});
