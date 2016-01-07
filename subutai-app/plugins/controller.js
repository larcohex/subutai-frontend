'use strict';

angular.module('subutai.plugins.controller', [])
	.controller('PluginsCtrl', PluginsCtrl);

PluginsCtrl.$inject = ['PluginsSrv', 'ngProgressFactory'];
function PluginsCtrl(PluginsSrv, ngProgressFactory) {

	var vm = this;

	vm.progressbar = ngProgressFactory.createInstance();
	vm.progressbar.start();

	angular.element(document).ready(function () {
		vm.progressbar.complete();
	});

	vm.plugins = [];

	function getPlugins() {
		try {
			PluginsSrv.getPlugins().success(function(data) {
				vm.plugins = data;
			});
		} catch(e) {}
	}
	getPlugins();
}
