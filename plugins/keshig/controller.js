'use strict';

angular.module('subutai.plugins.keshig.controller', [])
    .controller('KeshigCtrl', KeshigCtrl);

KeshigCtrl.$inject = ['keshigSrv', 'DTOptionsBuilder', 'DTColumnBuilder', '$resource', '$compile', 'SweetAlert'];
function KeshigCtrl(keshigSrv, DTOptionsBuilder, DTColumnBuilder, $resource, $compile, SweetAlert) {
    var vm = this;

	vm.activeTab = 'servers';
	vm.optionType = "clone";

	vm.server2Add = {};

	vm.serverTypes = [];
	vm.resourceHosts = [];
	vm.servers = [];

	//functions
	vm.updateOption = updateOption;
	vm.updateServer = updateOption;
	vm.deleteServer = deleteServer;
	vm.deleteOption = deleteOption;

	keshigSrv.getServerTypes().success(function (data) {
		vm.serverTypes = data;
		console.log(vm.serverTypes);
	});

	keshigSrv.getServers().success(function (data) {
		vm.servers = data;
		console.log(vm.servers);
	});

	keshigSrv.getResourceHosts().success(function (data) {
		vm.resourceHosts = [];
		for(var i = 0; i < data.length; i++) {
			if(data[i].hostname != 'management') {
				vm.resourceHosts.push(data[i]);
			}
		}
		console.log(vm.resourceHosts);
	});	

	vm.dtInstance = {};
	vm.servers = {};
	vm.dtOptions = DTOptionsBuilder
		.fromFnPromise(function() {
			return $resource(serverUrl + 'v1/keshig/server').query().$promise;
		})
		.withPaginationType('full_numbers')
		.withOption('stateSave', true)
		.withOption('order', [[ 1, "asc" ]])
		.withOption('createdRow', createdRow);

	vm.dtColumns = [
		DTColumnBuilder.newColumn(null).withTitle('').notSortable().renderWith(actionEdit),
		DTColumnBuilder.newColumn('name').withTitle('Role'),
		DTColumnBuilder.newColumn('name').withTitle('Type'),
		DTColumnBuilder.newColumn('name').withTitle('Address'),
		DTColumnBuilder.newColumn(null).withTitle('').notSortable().renderWith(actionButtons)
	];

	function createdRow(row, data, dataIndex) {
		$compile(angular.element(row).contents())($scope);
	}

	function actionEdit(data, type, full, meta) {
		vm.servers[data.id] = data;
		return '<a href class="b-icon b-icon_edit" ng-click="identityRoleCtrl.roleForm(identityRoleCtrl.roles[' + data.id + '])"></a>';
	}	

	function actionButtons(data, type, full, meta) {
		return '<a href class="b-icon b-icon_remove" ng-click="identityRoleCtrl.deleteRole(' + data.id + ')"></a>';
	}	

	function updateOption( id ) {
		if( id === undefined || id == null  ) {
			keshigSrv.addOption( vm.optionType, getObject(vm.optionType) )
		} else {
			keshigSrv.updateOption()( vm.optionType, getObject(vm.optionType) )
		}
	}

	function deleteOption( id )	{
		keshigSrv.deleteOption( id );
	}

	function deleteServer( id )	{
		keshigSrv.deleteServer( id );
	}

	function updateServer( id )	{
		var server = {};

		console.log(vm.server2Add);
		return;

		server.serverId = vm.serverId;
		server.serverName = vm.serverName;
		server.serverType = vm.serverType;

		if( id === undefined || id == null || !id ) {
			keshigSrv.addServer( server );
		} else {
			keshigSrv.updateServer( server );
		}
	}

	function getObject( type ) {
		switch( type.toLowerCase() ) {
			case "clone" :
				break;
			case "deploy" :
				break;
			case "build" :
				break;
			case "test" :
				break;
		}
	}
}
