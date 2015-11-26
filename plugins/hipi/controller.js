'use strict';

angular.module('subutai.plugins.hipi.controller', [])
    .controller('HipiCtrl', HipiCtrl)
	.directive('colSelectContainers', colSelectContainers);

HipiCtrl.$inject = ['hipiSrv', 'SweetAlert', 'DTOptionsBuilder', 'DTColumnDefBuilder'];

function HipiCtrl(hipiSrv, SweetAlert, DTOptionsBuilder, DTColumnDefBuilder) {
    var vm = this;
	vm.activeTab = 'install';
	vm.hipiInstall = {};
	vm.hadoopClusters = [];

	vm.dtOptions = DTOptionsBuilder
		.newOptions()
		.withOption('order', [[0, "asc" ]])
		.withOption('stateSave', true)
		.withPaginationType('full_numbers');

	vm.dtColumnDefs = [
		DTColumnDefBuilder.newColumnDef(0),
		DTColumnDefBuilder.newColumnDef(1),
		DTColumnDefBuilder.newColumnDef(2).notSortable()
	];

	hipiSrv.getHadoopClusters().success(function(data){
		vm.hadoopClusters = data;
		if(vm.hadoopClusters.length == 0) {
			SweetAlert.swal("ERROR!", 'No Hadoop clusters was found! Create Hadoop cluster first.', "error");
		}
	}).error(function(data){
		SweetAlert.swal("ERROR!", 'No Hadoop clusters was found! ERROR: ' + data, "error");
	});

}

function colSelectContainers() {
	return {
		restrict: 'E',
		templateUrl: 'plugins/hipi/directives/col-select/col-select-containers.html'
	}
};

