'use strict';

angular.module('subutai.blueprints.controller', [])
	.controller('BlueprintsViewCtrl', BlueprintsViewCtrl);

BlueprintsViewCtrl.$inject = ['$scope', 'environmentService', 'SweetAlert', 'ngDialog'];

function BlueprintsViewCtrl($scope, environmentService, SweetAlert, ngDialog) {

	var vm = this;
	vm.blueprints = {};
	vm.peers = [];
	vm.templates = [];
	vm.containersType = [];

	vm.blueprintFrom = {};
	vm.blueprintFrom.currentNode = {};
	vm.nodeList = [];
	vm.createEnviromentInfo = [];
	vm.nodesToCreate = [];
	vm.transportNodes = [];
	vm.subnetCIDR = '192.168.10.1/24';
	vm.currentBlueprint;
	vm.environmentToGrow;

	if($scope.ngDialogData !== undefined) {
		vm.blueprintFrom = $scope.ngDialogData;
		vm.nodeList = angular.copy(vm.blueprintFrom.nodeGroups);
		vm.blueprintFrom.nodeGroups = [];
	}

	vm.nodeStatus = 'Add to';
	vm.addBlueprintType = 'build';

	// functions
	vm.createBlueprintFrom = createBlueprintFrom;
	vm.addBlueprint = addBlueprint;
	vm.addNewNode = addNewNode;
	vm.setNodeData = setNodeData;
	vm.deleteBlueprint = deleteBlueprint;
	vm.showBlueprintCreateBlock = showBlueprintCreateBlock;
	vm.placeNode = placeNode;
	vm.removeNode = removeNode;
	vm.buildBlueprint = buildBlueprint;
	vm.growBlueprint = growBlueprint;


	function getBlueprints() {
		environmentService.getBlueprints().success(function (data) {
			vm.blueprints = data;
		});
	}
	getBlueprints();

	environmentService.getTemplates().success(function (data) {
		vm.templates = data;
	});

	environmentService.getContainersType().success(function (data) {
		vm.containersType = data;
	});

	function deleteBlueprint(blueprintId, key){
		SweetAlert.swal(
			{
				title: "Are you sure?",
				text: "Your will not be able to recover this blueprint!",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Yes, delete it!",
				cancelButtonText: "No, cancel plx!",
				closeOnConfirm: false,
				closeOnCancel: false,
				showLoaderOnConfirm: true
			},
			function (isConfirm) {
				if (isConfirm) {
					SweetAlert.swal("Deleted!", "Your blueprint has been deleted.", "success");
					environmentService.deleteBlueprint(blueprintId).success(function (data) {
						vm.blueprints.splice(key, 1);
					});
				} else {
					SweetAlert.swal("Cancelled", "Your blueprint is safe :)", "error");
				}
			}
		);
	}

	function showBlueprintCreateBlock(key, type) {
		vm.addBlueprintType = type;
		vm.createEnviromentInfo = angular.copy(vm.blueprints[key].nodeGroups);
		vm.currentBlueprint = angular.copy(vm.blueprints[key]);
		for(var i = 0; i < vm.blueprints[key].nodeGroups.length; i++) {
			vm.transportNodes[i] = {};
			vm.transportNodes[i].name = vm.blueprints[key].nodeGroups[i].name;
			vm.transportNodes[i].numberOfContainers = vm.blueprints[key].nodeGroups[i].numberOfContainers;
		}
		vm.nodesToCreate = [];
		vm.subnetCIDR = '192.168.10.1/24';
		addPanel('buildBlueprint');
	}

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

	function createBlueprintFrom(key) {
		if(key === undefined || key === null) key = false;

		var dataToForm;
		if(key !== false) {
			dataToForm = angular.copy(vm.blueprints[key]);
		}

		ngDialog.open({
			template: 'subutai-app/blueprints/partials/blueprintForm.html',
			controller: 'BlueprintsViewCtrl',
			controllerAs: 'blueprintsViewCtrl',
			data: dataToForm,
			preCloseCallback: function(value) {
				getBlueprints();
			}
		});
	}

	function addBlueprint() {
		if(vm.blueprintFrom.name === undefined) return;
		if(vm.nodeList === undefined || vm.nodeList.length == 0) return;

		var finalBlueprint = vm.blueprintFrom;
		finalBlueprint.nodeGroups = vm.nodeList;
		if(finalBlueprint.currentNod !== undefined) {
			finalBlueprint.nodeGroups.push(finalBlueprint.currentNode);
		}
		delete finalBlueprint.currentNode;

		environmentService.createBlueprint(JSON.stringify(finalBlueprint)).success(function (data) {
			vm.blueprints.push(data);
			ngDialog.closeAll();
		});

		vm.nodeList = [];
		vm.blueprintFrom = {};
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

	function addNewNode() {
		if(vm.nodeStatus == 'Add to') {
			var tempNode = vm.blueprintFrom.currentNode;
			vm.blueprintFrom.currentNode = {};
			vm.nodeList.push(tempNode);
		} else {
			vm.blueprintFrom.currentNode = {};
			vm.nodeStatus = 'Add to';
		}
	}

	function setNodeData(key) {
		vm.nodeStatus = 'Update in';
		vm.blueprintFrom.currentNode = vm.nodeList[key];
	}

}
