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
        when('/commits', {
            templateUrl: '/pages/commits.html',
            controller: 'CommitsController'
        }).
        when('/confirm', {
            templateUrl: '/pages/confirm.html',
            controller: 'ConfirmController'
        }).
        when('/customers', {
            templateUrl: '/pages/customers.html',
            controller: 'CustomersController'
        }).
        when('/exports', {
            templateUrl: '/pages/exports.html',
            controller: 'ExportsController'
        }).
        when('/export-file', {
            templateUrl: '/pages/export-file.html',
            controller: 'ExportFileController'
        }).
        when('/qbd-exports', {
            templateUrl: '/pages/qbd-exports.html',
            controller: 'QBDExportsController'
        }).
        when('/qbo-export', {
            templateUrl: '/pages/qbo-export.html',
            controller: 'QBOExportController'
        }).
        when('/qbo-exports', {
            templateUrl: '/pages/qbo-exports.html',
            controller: 'QBOExportsController'
        }).
        when('/qbo-reverse', {
            templateUrl: '/pages/qbo-reverse.html',
            controller: 'QBOReverseController'
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
        when('/rates', {
            templateUrl: '/pages/rates.html',
            controller: 'RatesController'
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
        when('/timesheets/add', {
            templateUrl: '/pages/timesheets/add.html',
            controller: 'TimesheetsAddController'
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
        return value.Guid.split('-')[4] + " - " + moment.parseZone(value.InAt).format('YYYY-MM-DD') + " thru " + moment.parseZone(value.OutAt).format('YYYY-MM-DD');
    };
});

app.filter('exportName', function () {
    return function (value) {
        if (!value) { return ''; }

        // Split at dash and return last segment
        return value.Commit.Guid.split('-')[4] + " - " + moment.parseZone(value.Commit.InAt).format('YYYY-MM-DD') + " thru " + moment.parseZone(value.Commit.OutAt).format('YYYY-MM-DD');
    };
});

app.filter('exportGuid', function () {
    return function (value) {
        if (!value) { return ''; }

        // Split at dash and return last segment
        return value.Commit.Guid.split('-')[4];
    };
});

app.filter('characters', function () {
    return function (input, chars, breakOnWord) {
        if (isNaN(chars)) return input;
        if (chars <= 0) return '';
        if (input && input.length > chars) {
            input = input.substring(0, chars);

            if (!breakOnWord) {
                var lastspace = input.lastIndexOf(' ');
                //get last space
                if (lastspace !== -1) {
                    input = input.substr(0, lastspace);
                }
            }else{
                while(input.charAt(input.length-1) === ' '){
                    input = input.substr(0, input.length -1);
                }
            }
            return input + '…';
        }
        return input;
    };
});

app.filter('splitcharacters', function() {
    return function (input, chars) {
        if (isNaN(chars)) return input;
        if (chars <= 0) return '';
        if (input && input.length > chars) {
            var prefix = input.substring(0, chars/2);
            var postfix = input.substring(input.length-chars/2, input.length);
            return prefix + '...' + postfix;
        }
        return input;
    };
});

app.filter('words', function () {
    return function (input, words) {
        if (isNaN(words)) return input;
        if (words <= 0) return '';
        if (input) {
            var inputWords = input.split(/\s+/);
            if (inputWords.length > words) {
                input = inputWords.slice(0, words).join(' ') + '…';
            }
        }
        return input;
    };
});