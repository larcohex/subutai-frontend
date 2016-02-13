'use strict';

angular.module('subutai.plugins.bazaar.controller', [])
	.controller('BazaarCtrl', BazaarCtrl);

BazaarCtrl.$inject = ['bazaarSrv', 'SweetAlert'];

function BazaarCtrl (bazaarSrv, SweetAlert, ngDialog) {
	var vm = this;
	vm.activeTab = "hub";
	vm.plugins = [];
	vm.installedPlugins = [];
	bazaarSrv.getPlugins().success (function (data) {
		vm.plugins = data.productsDto;
		console.log (vm.plugins);
	});


	vm.currentHubPlugin = {};
	vm.showPluginInfo = showPluginInfo;
	function showPluginInfo (plugin) {
		vm.currentHubPlugin = plugin;
		ngDialog.open ({
			template: "subutai-app/bazaar/partials/pluginInfo.html",
			scope: $scope
		});
	}
}