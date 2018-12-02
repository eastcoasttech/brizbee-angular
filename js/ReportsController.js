app.controller('ReportsController', function ($http, $rootScope, $scope, $window) {
    $scope.datepicker = { in_at: {}, out_at: {}, options: {} }

    $scope.showOutAtDatepicker = function () {
        $scope.datepicker.out_at.opened = true
    }

    $scope.showInAtDatepicker = function () {
        $scope.datepicker.in_at.opened = true
    }

    // Scroll to top
    $window.scrollTo(0, 0)
});
