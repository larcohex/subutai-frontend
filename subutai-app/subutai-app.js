var app = angular.module("subutai-app", [
    'ui.router',
    'mc.resizer'
    //'pascalprecht.translate',
    //'app.notifyGrowl'
])
    .config(routesConf)

routesConf.$inject = ['$stateProvider'];

function routesConf($stateProvider) {

    $stateProvider
    .state(
        "home", {
            url: "/home",
            templateUrl: "subutai-app/home/partials/view.html"
        }
    )
    .state(
        "console", {
            url: "/console",
            templateUrl: "subutai-app/console/partials/view.html"
        }
    );
}
