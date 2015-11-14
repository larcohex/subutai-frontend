'use strict';

angular.module('subutai.blueprints-build.controller', [])
	.controller('BlueprintsBuildCtrl', BlueprintsBuildCtrl);

BlueprintsBuildCtrl.$inject = ['$scope', 'environmentService', 'SweetAlert', 'ngDialog', '$stateParams'];

function BlueprintsBuildCtrl($scope, environmentService, SweetAlert, ngDialog, $stateParams) {

	$scope.options = {
		start: 1,
		range: {min: 1, max: 5}
	};

	var vm = this;
	vm.blueprint = {};
	vm.peers = [];
	vm.blueprintAction = $stateParams.action;

	vm.createEnviromentInfo = [];
	vm.nodesToCreate = [];
	vm.transportNodes = [];
	vm.subnetCIDR = '192.168.10.1/24';
	vm.currentBlueprint;
	vm.environmentToGrow;

	// functions
	vm.placeNode = placeNode;
	vm.removeNode = removeNode;
	vm.buildBlueprint = buildBlueprint;
	vm.growBlueprint = growBlueprint;


	function getCurrentBlueprint() {
		environmentService.getBlueprintById($stateParams.blueprintId).success(function (data) {
			console.log(data);
			vm.blueprint = data;

			for(var i = 0; i < vm.blueprint.nodeGroups.length; i++) {
				vm.transportNodes[i] = {};
				vm.transportNodes[i].name = vm.blueprint.nodeGroups[i].name;
				vm.transportNodes[i].numberOfContainers = vm.blueprint.nodeGroups[i].numberOfContainers;
			}
			vm.nodesToCreate = [];			
		});
	}
	getCurrentBlueprint();

	vm.subnetCIDR = '192.168.10.1/24';

	function placeNode(node, nodeGroup, key) {
		if(node.peer === undefined) return;
		var foundedInArray = false;
		for(var i = 0; i < vm.nodesToCreate.length; i++) {
			if(vm.nodesToCreate[i].peer == node.peer && vm.nodesToCreate[i].name == node.name) {
				vm.nodesToCreate[i].peer = node.peer;
				vm.nodesToCreate[i].numberOfContainers = parseInt(vm.nodesToCreate[i].numberOfContainers) + parseInt(node.numberOfContainers);
				foundedInArray = true;
				break;
			}
		}

		if(!foundedInArray) {
			var copyNode = angular.copy(node);
			copyNode.parentNode = key;
			vm.nodesToCreate.push(copyNode);
		}

		nodeGroup.numberOfContainers = nodeGroup.numberOfContainers - node.numberOfContainers;
		if(nodeGroup.numberOfContainers > 0) {
			node.numberOfContainers = nodeGroup.numberOfContainers;
		} else {
			node.numberOfContainers = 0;
			nodeGroup.numberOfContainers = 0;
		}
	}

	function removeNode(key) {
		var parentKey = vm.nodesToCreate[key].parentNode;
		var numberOfContainers = parseInt(vm.createEnviromentInfo[parentKey].numberOfContainers) + parseInt(vm.nodesToCreate[key].numberOfContainers);
		vm.createEnviromentInfo[parentKey].numberOfContainers = numberOfContainers;
		vm.nodesToCreate.splice(key, 1);
	}

	function getTopology() {
		var topology = {};
		for(var i = 0; i < vm.nodesToCreate.length; i++) {
			vm.currentBlueprint.nodeGroups[vm.nodesToCreate[i].parentNode].numberOfContainers = vm.nodesToCreate[i].numberOfContainers;
			if(topology[vm.nodesToCreate[i].peer] === undefined) {
				topology[vm.nodesToCreate[i].peer] = [];
			}
			topology[vm.nodesToCreate[i].peer].push(vm.currentBlueprint.nodeGroups[vm.nodesToCreate[i].parentNode]);
		}
		return JSON.stringify(topology);
	}

	function buildBlueprint(){
		var topology = getTopology();
		var postData = 'name=' + vm.currentBlueprint.name;
		postData += '&topology=' + topology;
		postData += '&subnet=' + vm.subnetCIDR;
		postData += '&key=null';
		environmentService.buildBlueprint(encodeURI(postData)).success(function (data) {
			getEnvironments();
			SweetAlert.swal("Success!", "Your environment has been created.", "success");
		}).error(function (error) {
			SweetAlert.swal("ERROR!", error.ERROR, "error");
		});
	}

	function growBlueprint() {
		var topology = getTopology();
		var postData = 'environmentId=' + vm.environmentToGrow + '&topology=' + topology;
		environmentService.growBlueprint(encodeURI(postData)).success(function (data) {
			console.log(data);
			SweetAlert.swal("Success!", "You successfully grow environment.", "success");
		}).error(function (error) {
			console.log(error);
			SweetAlert.swal("ERROR!", error.ERROR, "error");
		});
	}

}

