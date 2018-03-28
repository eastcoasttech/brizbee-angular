app.controller('ResetController', function ($http, $rootScope, $scope, $window) {
    // Focus on email input and scroll to top
    $window.document.getElementById("email_email_address").focus()
    $window.scrollTo(0, 0)
});
