var app = angular.module("subutai-app", [
	'ui.router',
	'ngResource',
	'oc.lazyLoad',
	'oitozero.ngSweetAlert',
	'ngDialog',
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
	.state("home", {
		url: "",
		templateUrl: "subutai-app/home/partials/view.html"
	})
	.state("blueprints", {
		url: "/blueprints",
		templateUrl: "subutai-app/blueprints/partials/view.html",
		resolve: {
			loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load([
						{files: ['scripts/scripts.js']},
						{
							name: 'subutai.blueprints',
							files: [
								'subutai-app/blueprints/blueprints.js',
								'subutai-app/blueprints/controller.js',
								'subutai-app/environment/service.js'
							]
						}
				]);
			}]
		}
	})
	.state("blueprintsActions", {
		url: "/blueprints/{blueprintId}/{action}/",
		templateUrl: "subutai-app/blueprintsBuild/partials/view.html",
		resolve: {
			loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load([
						{files: ['scripts/scripts.js']},
						{
							name: 'ya.nouislider',
							files: [
								'scripts/libs/nouislider.min.js',
								'assets/js/plugins/nouislider.min.js'
							]
						},
						{
							name: 'subutai.blueprints-build',
							files: [
								'subutai-app/blueprintsBuild/blueprintsBuild.js',
								'subutai-app/blueprintsBuild/controller.js',
								'subutai-app/environment/service.js'
							]
						}
				]);
			}]
		}
	})
	.state("environments", {
		url: "/environments",
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
			}]
		}
	})
}

function startup($rootScope, $state) {
	$rootScope.$state = $state;
}
