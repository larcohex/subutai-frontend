'use strict';

angular.module('subutai.monitoring.controller', [])
	.controller('MonitoringCtrl', MonitoringCtrl);

MonitoringCtrl.$inject = ['$scope', 'monitoringSrv'];

function MonitoringCtrl($scope, monitoringSrv) {

	var vm = this;
	vm.charts = [];

	//functions
	

	monitoringSrv.getInfo().success(function (data) {
		for(var i = 0; i < data.metrics.length; i++) {
			vm.charts.push(getChartData(data.metrics[i]));
		}
	});

	vm.onClick = function (points, evt) {
		console.log(points, evt);
	};

	function getChartData(obj) {
		console.log(obj);
		var result = {};
		result.values = [];
		result.labels = [];
		result.series = [];
		result.options = {};

		var setLabels = true;
		if(obj.series !== undefined) {

			if(obj.series[0].name.indexOf('cpu') > -1) {
				result.options = { pointDot: false, scaleShowVerticalLines: false, scaleOverride: true, scaleStartValue: 0, scaleStepWidth: 20, scaleSteps: 5, showXLabelseByEveryMinutes: 10 };
			} else {
				result.options = { pointDot: false, scaleShowVerticalLines: false, showXLabelseByEveryMinutes: 10 };
			}

			for(var i = 0; i < obj.series.length; i++) {
				var currentValues = [];
				for(var j = 0; j < obj.series[i].values.length; j++) {
					if(setLabels) {
						//var label = obj.series[i].values[j][0];
						var label = moment(obj.series[i].values[j][0]).format('H:mm');
						result.labels.push(label);
					}
					//var value = Math.round(obj.series[i].values[j][1]).toFixed(2);
					currentValues.push(obj.series[i].values[j][1]);
				}
				setLabels = false;
				result.values.push(currentValues);
				result.series.push(obj.series[i].tags.type);
			}
		}
		return result;
	}
};

