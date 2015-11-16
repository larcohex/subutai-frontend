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
	vm.strategies = [];
	vm.blueprintAction = $stateParams.action;

	vm.nodesToCreate = [];
	vm.transportNodes = [];
	vm.environments = [];
	vm.subnetCIDR = '192.168.10.1/24';
	vm.newEnvironmentName = '';
	vm.environmentToGrow;

	// functions
	vm.placeNode = placeNode;
	vm.removeNode = removeNode;
	vm.buildBlueprint = buildBlueprint;
	vm.growBlueprint = growBlueprint;

	if(vm.blueprintAction == 'grow') {
		environmentService.getEnvironments().success(function (data) {
			vm.environments = data;
		});
	}

	environmentService.getPeers().success(function (data) {
		vm.peers = data;
	});

	environmentService.getStrategies().success(function (data) {
		vm.strategies = data;
	});

	function getCurrentBlueprint() {
		environmentService.getBlueprintById($stateParams.blueprintId).success(function (data) {
			console.log(data);
			vm.blueprint = data;

			for(var i = 0; i < vm.blueprint.nodeGroups.length; i++) {
				vm.transportNodes[i] = {};
				vm.transportNodes[i].name = vm.blueprint.nodeGroups[i].name;
				vm.transportNodes[i].numberOfContainers = vm.blueprint.nodeGroups[i].numberOfContainers;
				vm.transportNodes[i].disabled = false;
				vm.transportNodes[i].options = {
					start: vm.transportNodes[i].numberOfContainers, 
					range: {
						min: 1, 
						max: vm.transportNodes[i].numberOfContainers
					}, 
					step: 1,
					tooltips: true,
					format: wNumb({
						decimals: 0,
					}),
					pips: {
						mode: "count", 
						values: vm.transportNodes[i].numberOfContainers, 
						density: 1
					}
				};
			}
		});
	}
	getCurrentBlueprint();

	function placeNode(node, nodeGroup, key) {
		if(node.peer === undefined) return;
		if(node.strategyId === undefined) return;
		var foundedInArray = false;
		for(var i = 0; i < vm.nodesToCreate.length; i++) {
			if(vm.nodesToCreate[i].peer == node.peer && vm.nodesToCreate[i].name == node.name) {
				vm.nodesToCreate[i].peer = node.peer;
				vm.nodesToCreate[i].strategyId = node.strategyId;
				vm.nodesToCreate[i].numberOfContainers = (
					parseInt(vm.nodesToCreate[i].numberOfContainers) + parseInt(node.options.start)
				);
				foundedInArray = true;
				break;
			}
		}

		if(!foundedInArray) {
			var copyNode = {};
			copyNode.name = node.name;
			copyNode.numberOfContainers = parseInt(node.options.start);
			copyNode.peer = node.peer;
			copyNode.strategyId = node.strategyId;
			copyNode.parentNode = key;
			vm.nodesToCreate.push(copyNode);
		}

		nodeGroup.numberOfContainers = nodeGroup.numberOfContainers - node.options.start;
		if(nodeGroup.numberOfContainers > 0) {
			node.numberOfContainers = nodeGroup.numberOfContainers;
			node.options.start = nodeGroup.numberOfContainers;
			node.options.min = nodeGroup.numberOfContainers;
			node.options.pips.values = nodeGroup.numberOfContainers;
			node.options.range.max = nodeGroup.numberOfContainers;
			node.disabled = false;
		} else {
			node.options.start = 0;
			node.numberOfContainers = 0;
			node.disabled = true;
			nodeGroup.numberOfContainers = 0;
		}
		console.log(vm.blueprint.nodeGroups);
	}

	function removeNode(key) {
		var parentKey = vm.nodesToCreate[key].parentNode;

		var numberOfContainers = (
			parseInt(vm.blueprint[parentKey].numberOfContainers) 
			+ 
			parseInt(vm.nodesToCreate[key].numberOfContainers)
		);

		vm.blueprint[parentKey].numberOfContainers = numberOfContainers;
		vm.nodesToCreate.splice(key, 1);
	}

	function getTopology() {
		var topology = {};
		for(var i = 0; i < vm.nodesToCreate.length; i++) {

			var containerPlacementStrategy = {"strategyId": vm.nodesToCreate[i].strategyId, "criteria": []};

			vm.blueprint.nodeGroups[vm.nodesToCreate[i].parentNode].numberOfContainers = vm.nodesToCreate[i].numberOfContainers;
			vm.blueprint.nodeGroups[vm.nodesToCreate[i].parentNode].containerPlacementStrategy = containerPlacementStrategy;
			if(topology[vm.nodesToCreate[i].peer] === undefined) {
				topology[vm.nodesToCreate[i].peer] = [];
			}
			topology[vm.nodesToCreate[i].peer].push(vm.blueprint.nodeGroups[vm.nodesToCreate[i].parentNode]);
		}
		return JSON.stringify(topology);
	}

	function buildBlueprint(){
		if(vm.newEnvironmentName === undefined || vm.newEnvironmentName.length < 1) return;
		if(vm.subnetCIDR === undefined || vm.subnetCIDR.length < 1) return;

		var topology = getTopology();
		var postData = 'name=' + vm.newEnvironmentName;
		postData += '&topology=' + topology;
		postData += '&subnet=' + vm.subnetCIDR;
		postData += '&key=null';

		SweetAlert.swal({
			title: "Are you sure?",
			text: "Build blueprint?",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, build it!",
			cancelButtonText: "No, cancel plx!",
			closeOnConfirm: false,
			closeOnCancel: false,
			showLoaderOnConfirm: true
		},
		function (isConfirm) {
			if (isConfirm) {
				environmentService.buildBlueprint(encodeURI(postData)).success(function (data) {
					getEnvironments();
					SweetAlert.swal("Success!", "Your environment has been created.", "success");
				}).error(function (error) {
					SweetAlert.swal("ERROR!", error.ERROR, "error");
				});
			} else {
				SweetAlert.swal("Cancelled", "Build blueprint canseled!", "error");
			}
		});
	}

	function growBlueprint() {
		console.log(vm.environmentToGrow);
		if(vm.environmentToGrow === undefined) return;
		var topology = getTopology();
		var postData = 'environmentId=' + vm.environmentToGrow + '&topology=' + topology;

		SweetAlert.swal(
			{
				title: "Are you sure?",
				text: "Grow blueprint!",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Yes, grow it!",
				cancelButtonText: "No, cancel plx!",
				closeOnConfirm: false,
				closeOnCancel: false,
				showLoaderOnConfirm: true
			},
			function (isConfirm) {
				if (isConfirm) {
					environmentService.growBlueprint(encodeURI(postData)).success(function (data) {
						console.log(data);
						SweetAlert.swal("Success!", "You successfully grow environment.", "success");
					}).error(function (error) {
						console.log(error);
						SweetAlert.swal("ERROR!", error.ERROR, "error");
					});
				} else {
					SweetAlert.swal("Cancelled", "Build blueprint canseled!", "error");
				}
			}
		);
	}

}

