// Disable mousewheel on a input number field when in focus
// (to prevent Cromium browsers change the value when scrolling)
$(':input[type=number]').on('mousewheel',function(e){ $(this).blur(); });

// Initialize Angular app
var app = angular.module('brizby', ['ngRoute', 'ngAnimate', 'ui.bootstrap']);

app.config(['$routeProvider', function ($routeProvider) {
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
        when('/in/confirm', {
            templateUrl: '/pages/in/confirm.html',
            controller: 'InConfirmController'
        }).
        when('/in/job', {
            templateUrl: '/pages/in/job.html',
            controller: 'InJobController'
        }).
        when('/in/task', {
            templateUrl: '/pages/in/task.html',
            controller: 'InTaskController'
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
        when('/punches', {
            templateUrl: '/pages/punches.html',
            controller: 'PunchesController'
        }).
        when('/register', {
            templateUrl: '/pages/register.html',
            controller: 'RegisterController'
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
        when('/users', {
            templateUrl: '/pages/users.html',
            controller: 'UsersController'
        }).
        otherwise({
            redirectTo: '/'
        })
    }
]);
