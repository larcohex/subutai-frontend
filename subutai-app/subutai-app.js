var app = angular.module("subutai-app", [
    'ui.router',
    'oc.lazyLoad',
    'ui.bootstrap',
    'mc.resizer',
    'pascalprecht.translate',
    'ui.tree',
    
    'subutai.col-select',
    
    'subutai.identity',
    'subutai.environment',
    'subutai.tracker',
    'subutai.metrics'
    //'app.notifyGrowl'
])
    .config(routesConf)

routesConf.$inject = ['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider'];

function routesConf($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {

    $urlRouterProvider.otherwise("/404");

    $ocLazyLoadProvider.config({
        debug: true
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
            templateUrl: "subutai-app/identity/partials/view.html"
            //resolve: {
            //    loadPlugin: function ($ocLazyLoad) {
            //        return $ocLazyLoad.load([
            //            {
            //                name: subutai.identity,
            //                files: ['subutai-app/identity/identity.js', 'subutai-app/identity/controller.js', 'subutai-app/identity/service.js']
            //            }
            //        ]);
            //    }
            //}
        }
    )
    .state(
        "metrics", {
            url: "/metrics",
            templateUrl: "subutai-app/metrics/partials/view.html"
        }
    )
    .state(
        "tracker", {
            url: "/tracker",
            templateUrl: "subutai-app/tracker/partials/view.html"
        }
    )
    .state(
        "environment", {
            url: "/environment",
            templateUrl: "subutai-app/environment/partials/view.html"
        }
    )
        .state(
        "404", {
            url: "/404",
            template: "Not found"
        }
    )
}
