'use strict';

angular.module('subutai.monitoring.controller', [])
	.controller('MonitoringCtrl', MonitoringCtrl);

MonitoringCtrl.$inject = ['$scope', 'monitoringSrv'];

function MonitoringCtrl($scope, monitoringSrv) {

	var vm = this;

	//functions
	vm.labels = ["12:30", "13:00", "13:30", "14:00", "14:30", "15:00"];
	vm.series = ['Series A', 'Series B'];
	vm.data = [
		[3, 2, 5, 1, 3, 5, 1],
		[2, 4, 4, 3, 3, 1, 4]
	];
	vm.onClick = function (points, evt) {
		console.log(points, evt);
	};
};

