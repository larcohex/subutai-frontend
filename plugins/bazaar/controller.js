'use strict';

angular.module('subutai.plugins.bazaar.controller', [])
	.controller('BazaarCtrl', BazaarCtrl);

BazaarCtrl.$inject = ['bazaarSrv', 'SweetAlert'];

function BazaarCtrl (bazaarSrv, SweetAlert) {
	var vm = this;
	vm.plugins = [];
	bazaarSrv.getPlugins().success (function (data) {
		vm.plugins = data;
		console.log (vm.plugins);
	});
}