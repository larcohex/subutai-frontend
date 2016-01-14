var app = angular.module('subutai-app', [
		'ui.router',
		'ngCookies',
		'ngResource',
		'oc.lazyLoad',
		'oitozero.ngSweetAlert',
		'ngDialog',
		'datatables',
		'720kb.tooltips',
		'ngTagsInput',
		'nvd3',
		'cfp.loadingBar'
	])
	.config(routesConf)

	.controller('SubutaiController', SubutaiController)
	.controller('CurrentUserCtrl', CurrentUserCtrl)
	.controller('LiveTrackerCtrl', LiveTrackerCtrl)
	.factory('liveTrackerSrv', liveTrackerSrv)

	.run(startup);

CurrentUserCtrl.$inject = ['$location', '$rootScope'];
routesConf.$inject = ['$httpProvider', '$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider'];
startup.$inject = ['$rootScope', '$state', '$location', '$http'];

function CurrentUserCtrl($location, $rootScope, ngDialog, $http, SweetAlert) {
	var vm = this;
	vm.currentUser = $rootScope.currentUser;
	vm.currentUserRoles = [];

	//function
	vm.logout = logout;


	function logout() {
		removeCookie('sptoken');
		sessionStorage.removeItem('currentUser');
		$location.path('login');
	}

	$rootScope.$on('$stateChangeStart',	function(event, toState, toParams, fromState, fromParams){
		if(localStorage.getItem('currentUser') !== undefined) {
			vm.currentUser = sessionStorage.getItem('currentUser');
		} else if($rootScope.currentUser !== undefined) {
			vm.currentUser = $rootScope.currentUser;
		}
	});
}

function SubutaiController($rootScope) {
	var vm = this;
	vm.bodyClass = '';

	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
		vm.layoutType = 'subutai-app/common/layouts/' + toState.data.layout + '.html';
		if (angular.isDefined(toState.data.bodyClass)) {
			vm.bodyClass = toState.data.bodyClass;
			return;
		}

		vm.bodyClass = '';
	});
}


function routesConf($httpProvider, $stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {

	$urlRouterProvider.otherwise('/404');

	$ocLazyLoadProvider.config({
		debug: false
	});

	//$locationProvider.html5Mode(true);

	$stateProvider
		.state('login', {
			url: '/login',
			templateUrl: 'subutai-app/login/partials/view.html',
			data: {
				bodyClass: 'b-body',
				layout: 'fullpage'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'subutai.login',
							files: [
								'subutai-app/login/login.js',
								'subutai-app/login/controller.js',
								'subutai-app/login/service.js'
							]
						}
					])
				}]
			}
		})
		.state('home', {
			url: '',
			templateUrl: 'subutai-app/monitoring/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'subutai.monitoring',
							files: [
								'subutai-app/monitoring/monitoring.js',
								'subutai-app/monitoring/controller.js',
								'subutai-app/monitoring/service.js',
								'subutai-app/environment/service.js',
								'subutai-app/peerRegistration/service.js'
							]
						}
					]);
				}]
			}
		})
		.state('blueprints', {
			url: '/blueprints',
			templateUrl: 'subutai-app/blueprints/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
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
		.state('blueprintsActions', {
			url: '/blueprints/{blueprintId}/{action}/',
			templateUrl: 'subutai-app/blueprintsBuild/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'ya.nouislider',
							files: [
								'scripts/libs/wNumb.js',
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
		.state('environments', {
			url: '/environments/{activeTab}',
			templateUrl: 'subutai-app/environment/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
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
		.state('containers', {
			url: '/containers/{environmentId}',
			templateUrl: 'subutai-app/containers/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'subutai.containers',
							files: [
								'subutai-app/containers/containers.js',
								'subutai-app/containers/controller.js',
								'subutai-app/environment/service.js'
							]
						}
					]);
				}]
			}
		})
		.state('kurjun', {
			url: '/kurjun',
			templateUrl: 'subutai-app/kurjun/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'subutai.kurjun',
							files: [
								'subutai-app/kurjun/kurjun.js',
								'subutai-app/kurjun/controller.js',
								'subutai-app/kurjun/service.js'
							]
						}
					]);
				}]
			}
		})
		.state('identity-user', {
			url: '/identity-user',
			templateUrl: 'subutai-app/identityUser/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'subutai.identity-user',
							files: [
								'subutai-app/identityUser/identityUser.js',
								'subutai-app/identityUser/controller.js',
								'subutai-app/identity/service.js'
							]
						}
					]);
				}]
			}
		})
		.state('identity-role', {
			url: '/identity-role',
			templateUrl: 'subutai-app/identityRole/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'subutai.identity-role',
							files: [
								'subutai-app/identityRole/identityRole.js',
								'subutai-app/identityRole/controller.js',
								'subutai-app/identity/service.js'
							]
						}
					]);
				}]
			}
		})
		.state('nodeReg', {
			url: '/nodeReg',
			templateUrl: 'subutai-app/nodeReg/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load(
						{
							name: 'subutai.nodeReg',
							files: [
								'subutai-app/nodeReg/nodeReg.js',
								'subutai-app/nodeReg/controller.js',
								'subutai-app/nodeReg/service.js',
								'subutai-app/environment/service.js'
							]
						});
				}]
			}
		})
		.state('tracker', {
			url: '/tracker',
			templateUrl: 'subutai-app/tracker/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
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
				}]
			}
		})
		.state('peer-registration', {
			url: '/peer-registration',
			templateUrl: 'subutai-app/peerRegistration/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'subutai.peer-registration',
							files: [
								'subutai-app/peerRegistration/peerRegistration.js',
								'subutai-app/peerRegistration/controller.js',
								'subutai-app/peerRegistration/service.js'
							]
						}
					]);
				}]
			}
		})
		.state('tokens', {
			url: '/tokens',
			templateUrl: 'subutai-app/tokens/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'subutai.tokens',
							files: [
								'subutai-app/tokens/tokens.js',
								'subutai-app/tokens/controller.js',
								'subutai-app/identity/service.js'
							]
						}
					]);
				}]
			}
		})
		.state('console', {
			url: '/console/{containerId}',
			templateUrl: 'subutai-app/console/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'vtortola.ng-terminal'
						},
						{
							name: 'subutai.console',
							files: [
								'subutai-app/console/console.js',
								'subutai-app/console/controller.js',
								'subutai-app/console/service.js',
								'subutai-app/environment/service.js',
								'subutai-app/peerRegistration/service.js'
							]
						}
					]);
				}]
			}
		})
		.state('plugins', {
			url: '/plugins',
			templateUrl: 'subutai-app/plugins/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'subutai.plugins',
							files: [
								'subutai-app/plugins/plugins.js',
								'subutai-app/plugins/controller.js',
								'subutai-app/plugins/service.js'
							]
						}
					]);
				}]
			}
		})
		.state('cassandra', {
			url: '/plugins/cassandra',
			templateUrl: 'plugins/cassandra/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'subutai.plugins.cassandra',
							files: [
								'plugins/cassandra/cassandra.js',
								'plugins/cassandra/controller.js',
								'plugins/cassandra/service.js',
								'subutai-app/environment/service.js',
								'subutai-app/peerRegistration/service.js'
							]
						}
					]);
				}]
			}
		})
		.state('keshig', {
			url: '/plugins/keshig',
			templateUrl: 'plugins/keshig/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'subutai.plugins.keshig',
							files: [
								'plugins/keshig/keshig.js',
								'plugins/keshig/controller.js',
								'plugins/keshig/service.js',
								'subutai-app/peerRegistration/service.js'
							]
						}
					]);
				}]
			}
		})
		.state('hadoop', {
			url: '/plugins/hadoop',
			templateUrl: 'plugins/hadoop/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'subutai.plugins.hadoop',
							files: [
								'plugins/hadoop/hadoop.js',
								'plugins/hadoop/controller.js',
								'plugins/hadoop/service.js',
								'subutai-app/environment/service.js',
							]
						}
					]);
				}]
			}
		})
		.state('solr', {
			url: '/plugins/solr',
			templateUrl: 'plugins/solr/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'subutai.plugins.solr',
							files: [
								'plugins/solr/solr.js',
								'plugins/solr/controller.js',
								'plugins/solr/service.js',
								'subutai-app/environment/service.js'
							]
						}
					]);
				}]
			}
		})
		.state('mahout', {
			url: '/plugins/mahout',
			templateUrl: 'plugins/mahout/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'subutai.plugins.mahout',
							files: [
								'plugins/mahout/mahout.js',
								'plugins/mahout/controller.js',
								'plugins/mahout/service.js',
								'plugins/hadoop/service.js',
								'subutai-app/environment/service.js'
							]
						}
					]);
				}]
			}
		})
		.state('pig', {
			url: '/plugins/pig',
			templateUrl: 'plugins/pig/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'subutai.plugins.pig',
							files: [
								'plugins/pig/pig.js',
								'plugins/pig/controller.js',
								'plugins/pig/service.js',
								'plugins/hadoop/service.js',
								'subutai-app/environment/service.js'
							]
						}
					]);
				}]
			}
		})
		.state('hipi', {
			url: '/plugins/hipi',
			templateUrl: 'plugins/hipi/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'subutai.plugins.hipi',
							files: [
								'plugins/hipi/hipi.js',
								'plugins/hipi/controller.js',
								'plugins/hipi/service.js',
								'plugins/hadoop/service.js',
								'subutai-app/environment/service.js'
							]
						}
					]);
				}]
			}
		})
		.state('lucene', {
			url: '/plugins/lucene',
			templateUrl: 'plugins/lucene/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'subutai.plugins.lucene',
							files: [
								'plugins/lucene/lucene.js',
								'plugins/lucene/controller.js',
								'plugins/lucene/service.js',
								'plugins/hadoop/service.js',
								'subutai-app/environment/service.js'
							]
						}
					]);
				}]
			}
		})
		.state('nutch', {
			url: '/plugins/nutch',
			templateUrl: 'plugins/nutch/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'subutai.plugins.nutch',
							files: [
								'plugins/nutch/nutch.js',
								'plugins/nutch/controller.js',
								'plugins/nutch/service.js',
								'plugins/hadoop/service.js',
								'subutai-app/environment/service.js'
							]
						}
					]);
				}]
			}
		})
		.state('elasticsearch', {
			url: '/plugins/elasticsearch',
			templateUrl: 'plugins/elasticsearch/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'subutai.plugins.elastic-search',
							files: [
								'plugins/elasticsearch/elastic-search.js',
								'plugins/elasticsearch/controller.js',
								'plugins/elasticsearch/service.js',
								'subutai-app/environment/service.js'
							]
						}
					]);
				}]
			}
		})
		.state('oozie', {
			url: '/plugins/oozie',
			templateUrl: 'plugins/oozie/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'subutai.plugins.oozie',
							files: [
								'plugins/oozie/oozie.js',
								'plugins/oozie/controller.js',
								'plugins/oozie/service.js',
								'plugins/hadoop/service.js',
								'subutai-app/environment/service.js'
							]
						}
					]);
				}]
			}
		})
		.state('mongo', {
			url: '/plugins/mongo',
			templateUrl: 'plugins/mongo/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'subutai.plugins.mongo',
							files: [
								'plugins/mongo/mongo.js',
								'plugins/mongo/controller.js',
								'plugins/mongo/service.js',
								'plugins/hadoop/service.js',
								'subutai-app/environment/service.js'
							]
						}
					]);
				}]
			}
		})
		.state('hive', {
			url: '/plugins/hive',
			templateUrl: 'plugins/hive/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'subutai.plugins.hive',
							files: [
								'plugins/hive/hive.js',
								'plugins/hive/controller.js',
								'plugins/hive/service.js',
								'plugins/hadoop/service.js',
								'subutai-app/environment/service.js'
							]
						}
					]);
				}]
			}
		})
		.state('presto', {
			url: '/plugins/presto',
			templateUrl: 'plugins/presto/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'subutai.plugins.presto',
							files: [
								'plugins/presto/presto.js',
								'plugins/presto/controller.js',
								'plugins/presto/service.js',
								'plugins/hadoop/service.js',
								'subutai-app/environment/service.js'
							]
						}
					]);
				}]
			}
		})
		.state('spark', {
			url: '/plugins/spark',
			templateUrl: 'plugins/spark/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'subutai.plugins.spark',
							files: [
								'plugins/spark/spark.js',
								'plugins/spark/controller.js',
								'plugins/spark/service.js',
								'plugins/hadoop/service.js',
								'subutai-app/environment/service.js'
							]
						}
					]);
				}]
			}
		})
		.state('storm', {
			url: '/plugins/storm',
			templateUrl: 'plugins/storm/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'subutai.plugins.storm',
							files: [
								'plugins/storm/storm.js',
								'plugins/storm/controller.js',
								'plugins/storm/service.js',
								'subutai-app/environment/service.js'
							]
						}
					]);
				}]
			}
		})
		.state('zookeeper', {
			url: '/plugins/zookeeper',
			templateUrl: 'plugins/zookeeper/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'subutai.plugins.zookeeper',
							files: [
								'plugins/zookeeper/zookeeper.js',
								'plugins/zookeeper/controller.js',
								'plugins/zookeeper/service.js',
								'plugins/hadoop/service.js',
								'subutai-app/environment/service.js'
							]
						}
					]);
				}]
			}
		})
		.state('flume', {
			url: '/plugins/flume',
			templateUrl: 'plugins/flume/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'subutai.plugins.flume',
							files: [
								'plugins/flume/flume.js',
								'plugins/flume/controller.js',
								'plugins/flume/service.js',
								'plugins/hadoop/service.js',
								'subutai-app/environment/service.js'
							]
						}
					]);
				}]
			}
		})
		.state('accumulo', {
			url: '/plugins/accumulo',
			templateUrl: 'plugins/accumulo/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'subutai.plugins.accumulo',
							files: [
								'plugins/accumulo/accumulo.js',
								'plugins/accumulo/controller.js',
								'plugins/accumulo/service.js',
								'plugins/hadoop/service.js',
								'plugins/zookeeper/service.js',
								'subutai-app/environment/service.js'
							]
						}
					]);
				}]
			}
		})
		.state('shark', {
			url: '/plugins/shark',
			templateUrl: 'plugins/shark/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'subutai.plugins.shark',
							files: [
								'plugins/shark/shark.js',
								'plugins/shark/controller.js',
								'plugins/shark/service.js',
								'plugins/hadoop/service.js',
								'plugins/spark/service.js',
								'subutai-app/environment/service.js'
							]
						}
					]);
				}]
			}
		})
		.state('hbase', {
			url: '/plugins/hbase',
			templateUrl: 'plugins/hbase/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'subutai.plugins.hbase',
							files: [
								'plugins/hbase/hbase.js',
								'plugins/hbase/controller.js',
								'plugins/hbase/service.js',
								'plugins/hadoop/service.js',
								'subutai-app/environment/service.js'
							]
						}
					]);
				}]
			}
		})
		.state('generic', {
			url: '/plugins/generic',
			templateUrl: 'plugins/generic/partials/view.html',
			data: {
				bodyClass: '',
				layout: 'default'
			},
			resolve: {
				loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							name: 'vtortola.ng-terminal'
						},
						{
							name: 'subutai.plugins.generic',
							files: [
								'plugins/generic/generic.js',
								'plugins/generic/controller.js',
								'plugins/generic/service.js',
								'subutai-app/environment/service.js'
							]
						}
					]);
				}]
			}
		})
		.state('404', {
			url: '/404',
			templateUrl: 'subutai-app/common/partials/404.html',
			data: {
				bodyClass: 'b-body',
				layout: 'fullpage'
			}
		});

	$httpProvider.interceptors.push(function($q, $location) {
		return {
			'responseError': function(rejection) {
				if (rejection.status == 401 && $.inArray($location.path(), ['/login']) === -1) {
					$location.path('/login');
				}
				return $q.reject(rejection);
			}
		};
	});
}

function startup($rootScope, $state, $location, $http) {

	$http.defaults.headers.common['sptoken'] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkNTYxMDFlNC01NzhlLTQ2NGYtYjM0Yy1kZDBlM2ExZGI0OTgiLCJpc3MiOiJpby5zdWJ1dGFpIn0.AqvFeNb4o4rFXWcYvK_jD3MHLlNwloOZTAFuu3i4l7w';

	$rootScope.$on('$stateChangeStart',	function(event, toState, toParams, fromState, fromParams){
		LOADING_SCREEN('none');
		/*var restrictedPage = $.inArray($location.path(), ['/login']) === -1;
		if (restrictedPage && !getCookie('sptoken')) {
			sessionStorage.removeItem('currentUser');
			$location.path('/login');
		}*/
	});
	//$http.defaults.headers.common['sptoken'] = getCookie('sptoken');

	$rootScope.$state = $state;
}

function getCookie(cname) {
	var name = cname + '=';
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1);
		if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
	}
	return false;
}

function removeCookie( name ) {
	document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

app.directive('dropdownMenu', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attr) {
			function colEqualHeight() {
				if( $('.b-nav').height() > $('.b-workspace').height() ) {
					$('.b-workspace').height( $('.b-nav').height() );
				}else if( $('.b-nav').height() < $('.b-workspace').height() ) {
					$('.b-nav').height( $('.b-workspace').height() );
				}
			}
			//colEqualHeight();

			$('.b-nav-menu-link').on('click', function(){
				if($(this).next('.b-nav-menu__sub').length > 0) {
					if($(this).parent().hasClass('b-nav-menu_active')) {
						$(this).parent().removeClass('b-nav-menu_active');
						$(this).next('.b-nav-menu__sub').slideUp(300, function(){
							//colEqualHeight();
						});
					} else {
						$('.b-nav-menu_active').removeClass('b-nav-menu_active')
						$('.b-nav-menu__sub').slideUp(200);
						$(this).parent().addClass('b-nav-menu_active');
						$(this).next('.b-nav-menu__sub').slideDown(300, function(){
							//colEqualHeight();
						});
					}
					return false;
				}
			});
		}
	}
});

app.directive('checkbox-list-dropdown', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attr) {
			$('.b-form-input_dropdown').click(function () {
				$(this).toggleClass('is-active');
			});

			$('.b-form-input-dropdown-list').click(function(e) {
				e.stopPropagation();
			});
		}
	}
});

//Global variables

var SERVER_URL = 'http://10.10.12.163:8080/';

var STATUS_UNDER_MODIFICATION = 'UNDER_MODIFICATION';
var VARS_TOOLTIP_TIMEOUT = 1600;

function LOADING_SCREEN(displayStatus) {
	if(displayStatus === undefined || displayStatus === null) displayStatus = 'block';
	var loadScreen = document.getElementsByClassName('js-loading-screen')[0];
	if(loadScreen) {
		loadScreen.style.display = displayStatus;
	}
}

function VARS_MODAL_CONFIRMATION( object, title, text, func )
{
	object.swal({
			title: title,
			text: text,
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#ff3f3c",
			confirmButtonText: "Delete",
			cancelButtonText: "Cancel",
			closeOnConfirm: false,
			closeOnCancel: true,
			showLoaderOnConfirm: true
		},
		func
	);
}

function VARS_MODAL_ERROR( object, text )
{
	object.swal({
		title: "ERROR!",
		text: text,
		type: "error",
		confirmButtonColor: "#ff3f3c"
	});
}

quotaColors = [];
quotaColors['CUSTOM'] = 'blue';
quotaColors['HUGE'] = 'bark-red';
quotaColors['LARGE'] = 'red';
quotaColors['MEDIUM'] = 'orange';
quotaColors['SMALL'] = 'yellow';
quotaColors['TINY'] = 'green';
quotaColors['INACTIVE'] = 'grey';

var permissionsDefault = [
	{
		'object': 1,
		'name': 'Identity-Management',
		'scope': 1,
		'read': true,
		'write': true,
		'update': true,
		'delete': true,
	},
	{
		'object': 2,
		'name': 'Peer-Management',
		'scope': 1,
		'read': true,
		'write': true,
		'update': true,
		'delete': true,
	},
	{
		'object': 3,
		'name': 'Environment-Management',
		'scope': 1,
		'read': true,
		'write': true,
		'update': true,
		'delete': true,
	},
	{
		'object': 4,
		'name': 'Resource-Management',
		'scope': 1,
		'read': true,
		'write': true,
		'update': true,
		'delete': true,
	},
	{
		'object': 5,
		'name': 'Template-Management',
		'scope': 1,
		'read': true,
		'write': true,
		'update': true,
		'delete': true,
	},
	{
		'object': 6,
		'name': 'Karaf-Server-Administration',
		'scope': 1,
		'read': true,
		'write': true,
		'update': true,
		'delete': true,
	},
	{
		'object': 7,
		'name': 'Karaf-Server-Management',
		'scope': 1,
		'read': true,
		'write': true,
		'update': true,
		'delete': true,
	}
];


function toggle (source, name) {
	checkboxes = document.getElementsByName (name);
	for (var i = 0; i < checkboxes.length; i++) {
		checkboxes[i].checked = source.checked;
	}
}
