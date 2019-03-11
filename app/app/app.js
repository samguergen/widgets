var myApp = angular.module('myApp', ['ui.router', 'ngAnimate', 'angularUtils.directives.dirPagination','ngFileUpload']);

myApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    // console.log('inside of config block');
    var viewsPath = "views/";
    var appPath = "/";
    var today = new Date();
    if (location.host === "localhost:8080") {
        viewsPath = "app/views/";
        appPath = "app/";
    };

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: viewsPath + 'home.html'
        })
        .state('resume', {
            url: '/resume',
            templateUrl: viewsPath + 'resume.html'
        })
        .state('contact', {
            url: '/contact',
            templateUrl: viewsPath + 'contact.html',
            params: {
              contact: null
            }
        })
        .state('portfolio', {
            url: '/portfolio',
            templateUrl: viewsPath + 'portfolio.html',
            params: {
              anchor: null
            }
        })
        .state('keyword-pages', {
            url: '/keyword-pages',
            templateUrl: viewsPath + 'keyword-pages.html'
        })
        .state('login', {
            url: '/login',
            templateUrl: viewsPath + 'login.html'
        })
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: viewsPath + 'dashboard.html',
            controller: 'FileUploadCtrl'
        })
        .state('view-form', {
            url: '/view-form',
            templateUrl: viewsPath + 'view-form.html',
            controller: 'FileUploadCtrl',
            params: {
                formObj: null,
                formType: null
            }
        })
        .state('backup-pdf', {
            url: '/backup-pdf',
            templateUrl: viewsPath + 'backup-pdf.html'
        })
        .state('important-docs-landing', {
            url: '/important-docs-landing',
            templateUrl: viewsPath + 'important-docs-landing.html',
            controller: 'FileUploadCtrl'
        })
        .state('comments', {
            url: '/comments?filter',
            templateUrl: viewsPath + 'comments.html',
            params: {
              affiliate: null,
              commentsPhoto: []
            }
        })
        .state('documents', {
            url: '/documents?filter',
            templateUrl: viewsPath + 'documents.html',
            controller: 'FileUploadCtrl',
            params: {
              filter: null
            }
        })
        .state('web-traffic', {
            url: '/web-traffic?filter',
            templateUrl: viewsPath + 'web-traffic.html',
            params: {
              filter: null
            }
        })
        .state('timesheet', {
            url: '/timesheet?day',
            // abstract: true,
            templateUrl: viewsPath + 'timesheet.html',
            controller: 'TimesheetCtrl',
            params : {
              day: null,
              timesheet: null,
              viewNewTimesheet: false
            }
        })
        .state('timesheets', {
            url: '/timesheets',
            templateUrl: viewsPath + 'timesheets.html',
            controller: 'TimesheetCtrl',
            params : {
              day: null,
              timesheet: null,
              viewNewTimesheet: false
            }
        })
        .state('shift-scheduler', {
            url: '/shift-scheduler',
            templateUrl: viewsPath + 'shift-scheduler.html',
            controller: 'CalendarCtrl'
        })
        .state('blog-thumbnail', {
            url: '/blog-thumbnail',
            templateUrl: viewsPath + 'blog-thumbnail.html'
        })

    // default fall back route
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true).hashPrefix('');

})

myApp.run(['$rootScope', '$location', '$window', '$state', '$stateParams',
    function($rootScope, $location, $window, $state, $stateParams) {
        $rootScope.$on('$routeChangeSuccess',
            function(event) {
                if (!$window.ga) {
                    return;
                }
                $window.ga('send', 'pageview', {
                    page: $location.path()
                });
            });
    }
]);
