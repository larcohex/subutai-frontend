var app = angular.module("subutai-app", [
    'ui.router',
    'ui.bootstrap',
    'mc.resizer',
    'pascalprecht.translate',
    
    'subutai.col-select',
    
    'subutai.identity',
    'subutai.environment'
    //'app.notifyGrowl'
])
    .config(routesConf)

routesConf.$inject = ['$stateProvider'];

function routesConf($stateProvider) {

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
        }
    )
        .state(
        "metrics", {
            url: "/metrics",
            templateUrl: "subutai-app/metrics/partials/view.html"
        }
    )
    .state(
        "environment", {
            url: "/environment",
            templateUrl: "subutai-app/environment/partials/view.html"
            }
    );
}
