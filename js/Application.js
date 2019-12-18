// Disable mousewheel on a input number field when in focus
// (to prevent Cromium browsers change the value when scrolling)
$(':input[type=number]').on('mousewheel',function(e){ $(this).blur(); });

// Initialize Angular app
var app = angular.module('brizbee', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'ui.utils.masks', 'ngCookies', 'LocalStorageModule']);

app.config(function ($routeProvider, localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('brizbee')

    $routeProvider.
        when('/', {
            templateUrl: '/pages/login.html',
            controller: 'LoginController'
        }).
        when('/confirm', {
            templateUrl: '/pages/confirm.html',
            controller: 'ConfirmController'
        }).
        when('/customers', {
            templateUrl: '/pages/customers.html',
            controller: 'CustomersController'
        }).
        when('/export-file', {
            templateUrl: '/pages/export-file.html',
            controller: 'ExportFileController'
        }).
        when('/export-quickbooks-online', {
            templateUrl: '/pages/export-quickbooks-online.html',
            controller: 'ExportQuickBooksOnlineController'
        }).
        when('/in/confirm', {
            templateUrl: '/pages/in/confirm.html',
            controller: 'InConfirmController'
        }).
        when('/in/done', {
            templateUrl: '/pages/in/done.html',
            controller: 'InDoneController'
        }).
        when('/in/job', {
            templateUrl: '/pages/in/job.html',
            controller: 'InJobController'
        }).
        when('/in/task', {
            templateUrl: '/pages/in/task.html',
            controller: 'InTaskController'
        }).
        when('/timesheets/add', {
            templateUrl: '/pages/timesheets/add.html',
            controller: 'TimesheetsAddController'
        }).
        when('/jobs', {
            templateUrl: '/pages/jobs.html',
            controller: 'JobsController'
        }).
        when('/locations', {
            templateUrl: '/pages/locations.html',
            controller: 'LocationsController'
        }).
        when('/my/organization', {
            templateUrl: '/pages/my/organization.html',
            controller: 'MyOrganizationController'
        }).
        when('/my/user', {
            templateUrl: '/pages/my/user.html',
            controller: 'MyUserController'
        }).
        when('/out/confirm', {
            templateUrl: '/pages/out/confirm.html',
            controller: 'OutConfirmController'
        }).
        when('/out/done', {
            templateUrl: '/pages/out/done.html',
            controller: 'OutDoneController'
        }).
        when('/punches', {
            templateUrl: '/pages/punches.html',
            controller: 'PunchesController'
        }).
        when('/register', {
            templateUrl: '/pages/register.html',
            controller: 'RegisterController'
        }).
        when('/reports', {
            templateUrl: '/pages/reports.html',
            controller: 'ReportsController'
        }).
        when('/reset', {
            templateUrl: '/pages/reset.html',
            controller: 'ResetController'
        }).
        when('/setup', {
            templateUrl: '/pages/setup.html',
            controller: 'SetupController'
        }).
        when('/status', {
            templateUrl: '/pages/status.html',
            controller: 'StatusController'
        }).
        when('/timesheets', {
            templateUrl: '/pages/timesheets.html',
            controller: 'TimesheetsController'
        }).
        when('/users', {
            templateUrl: '/pages/users.html',
            controller: 'UsersController'
        }).
        otherwise({
            redirectTo: '/'
        })
});

app.filter('commitName', function () {
    return function (value) {
        if (!value) { return ''; }

        // Split at dash and return last segment
        return value.split('-')[4];
    };
});
