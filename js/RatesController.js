app.controller('RatesController', function ($http, $rootScope, $scope, $uibModal, $window) {
    $scope.loading = { rates: false }
    $scope.rates = []
    $scope.ratesPageStart = 0

    // Reset the document title, in case the session expired
    $(document).prop('title', 'Dashboard - BRIZBEE')

    $scope.refreshRates = function () {
        $scope.rates = []
        $scope.loading.rates = true
        $http.get($rootScope.baseUrl + "/odata/Rates?$count=true&$orderby=Type,Name&$expand=ParentRate")
            .then(response => {
                $scope.loading.rates = false
                $scope.ratesCount = response.data["@odata.count"]
                $scope.rates = response.data.value
            }, error => {
                $scope.loading.rates = false
                console.error(error)
            })
    }

    $scope.showEditRate = function (rate) {
        var instance = $uibModal.open({
            templateUrl: '/pages/details/rate.html',
            controller: 'RateDetailsController',
            resolve: {
                rate: function () {
                    return rate;
                }
            }
        })
        
        instance.result
            .then((msg) => {
                $scope.refreshRates();
            }, () => {
                console.log('dismissed');
            })
    }

    $scope.showNewRate = function () {
        var instance = $uibModal.open({
            templateUrl: '/pages/details/rate.html',
            controller: 'RateDetailsController',
            resolve: {
                rate: function () {
                    return {};
                }
            }
        })

        instance.result
            .then((msg) => {
                $scope.refreshRates();
            }, () => {
                console.log('dismissed');
            })
    }

    $scope.ratesEnd = function () {
        return $scope.ratesPageStart + 20 < $scope.ratesCount ? $scope.ratesPageStart + 20 : $scope.ratesCount;
    };

    $scope.ratesNext = function () {
        $scope.ratesPageStart = $scope.ratesPageStart + 20
        $scope.refreshRates()
    }
    
    $scope.ratesPrevious = function () {
        $scope.ratesPageStart = $scope.ratesPageStart - 20
        $scope.refreshRates()
    }

    $scope.ratesStart = function () {
        return $scope.ratesPageStart + 1
    }

    $scope.refreshRates();

    // Scroll to top
    $window.scrollTo(0, 0);
});
