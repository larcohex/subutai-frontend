'use strict';

LiveTrackerCtrl.$inject = ['liveTrackerSrv', '$scope', '$rootScope', '$timeout'];


function LiveTrackerCtrl(liveTrackerSrv, $scope, $rootScope, $timeout) {

	var vm = this;

	vm.selectedModule = 'ENVIRONMENT MANAGER';
	vm.startDate = new Date("2015-01-01");
	vm.endDate = new Date("2015-12-31");

}

