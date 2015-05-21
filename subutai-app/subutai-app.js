var app = angular.module("subutai-app", [
    'ui.router',
    'oc.lazyLoad',
    'ui.bootstrap',
    'mc.resizer',
    'pascalprecht.translate',
    'ui.tree',
    'localytics.directives'
    //'app.notifyGrowl'
])
    .config(routesConf)
    .run(startup);

routesConf.$inject = ['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider'];
startup.$inject = ['$rootScope', '$state'];

function routesConf($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {

    $urlRouterProvider.otherwise("/404");

    $ocLazyLoadProvider.config({
        debug: false
    });

    $stateProvider
    .state(
        "home", {
            url: "",
            templateUrl: "subutai-app/home/partials/view.html"
        }
    )
    .state(
        "console", {
            url: "/console",
            templateUrl: "subutai-app/console/partials/view.html"
        }
    )
    .state(
        "identity", {
            url: "/identity",
            templateUrl: "subutai-app/identity/partials/view.html",
            resolve: {
                loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'subutai.identity',
                            files: [
                                'subutai-app/identity/identity.js',
                                'subutai-app/identity/controller.js',
                                'subutai-app/identity/service.js'
                            ]
                        },
                        {
                            name: 'subutai.col-select',
                            files: ['subutai-app/common/directives/col-select/col-select.js']
                        }
                    ]);
                } ]
            }
        }
    )
    .state(
        "metrics", {
            url: "/metrics",
            templateUrl: "subutai-app/metrics/partials/view.html",
            resolve: {
                loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'subutai.metrics',
                            files: [
                                'subutai-app/metrics/metrics.js',
                                'subutai-app/metrics/controller.js',
                                'subutai-app/metrics/service.js'
                            ]
                        }
                    ]);
                } ]
            }
        }
    )
    .state(
        "tracker", {
            url: "/tracker",
            templateUrl: "subutai-app/tracker/partials/view.html",
            resolve: {
                loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'subutai.tracker',
                            files: [
                                'subutai-app/tracker/tracker.js',
                                'subutai-app/tracker/controller.js',
                                'subutai-app/tracker/service.js'
                            ]
                        }
                    ]);
                } ]
            }
        }
    )
    .state(
        "environment", {
            url: "/environment",
            templateUrl: "subutai-app/environment/partials/view.html",
            resolve: {
                loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'subutai.environment',
                            files: [
                                'subutai-app/environment/environment.js',
                                'subutai-app/environment/controller.js',
                                'subutai-app/environment/service.js'
                            ]
                        }
                    ]);
                } ]
            }
        }
    )
    .state(
        "peers", {
            url: "/peers",
            templateUrl: "subutai-app/peer/partials/view.html",
            resolve: {
                loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'subutai.peer',
                            files: [
                                'subutai-app/peer/peer.js',
                                'subutai-app/peer/controller.js',
                                'subutai-app/peer/service.js'
                            ]
                        }
                    ]);
                } ]
            }
        }
    )
    .state(
        "404", {
            url: "/404",
            template: "Not found"
        }
    )
}

function startup($rootScope, $state) {
    $rootScope.$state = $state;
}