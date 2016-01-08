'use strict';

LiveTrackerCtrl.$inject = ['liveTrackerSrv', '$scope', '$rootScope', '$timeout'];


function LiveTrackerCtrl(liveTrackerSrv, $scope, $rootScope, $timeout) {

	var vm = this;
	vm.modules = [];

	vm.selectedModule = 'ENVIRONMENT_MANAGER';
	vm.startDate = new Date("2015-01-01");
	vm.endDate = new Date("2015-12-31");

	liveTrackerSrv.getModules().success(function (data) {
		vm.modules = data;
	});

}

