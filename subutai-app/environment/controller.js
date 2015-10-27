'use strict';

angular.module('subutai.environment.controller', [])
	.controller('EnvironmentViewCtrl', EnvironmentViewCtrl);

EnvironmentViewCtrl.$inject = ['$scope', 'environmentService', 'SweetAlert'];

function EnvironmentViewCtrl($scope, environmentService, SweetAlert) {

	var vm = this;
	vm.blueprints = {};
	vm.peers = [];
	vm.templates = [];

	vm.blueprintFrom = {};
	vm.blueprintFrom.currentNode = {};
	vm.nodeList = [];
	vm.createEnviromentInfo = [];
	vm.nodesToCreate = [];
	vm.transportNodes = [];
	vm.subnetCIDR = '192.168.10.1/24';
	vm.currentBlueprint;

	vm.nodeStatus = 'Add to';

	// functions
	vm.addBlueprint = addBlueprint;
	vm.addNewNode = addNewNode;
	vm.setNodeData = setNodeData;
	vm.deleteBlueprint = deleteBlueprint;
	vm.addPanel = addPanel;
	vm.showBlueprintCreateBlock = showBlueprintCreateBlock;
	vm.placeNode = placeNode;
	vm.removeNode = removeNode;
	vm.buildBlueprint = buildBlueprint;

	environmentService.getBlueprints().success(function (data) {
		vm.blueprints = data;
	});

	environmentService.getTemplates().success(function (data) {
		vm.templates = data;
	});

	environmentService.getPeers().success(function (data) {
		vm.peers = data;
	});	

	$scope.removeEnvironment = removeEnvironment;
	$scope.destroyEnvironment = destroyEnvironment;
	$scope.addBlueprintNode = addBlueprintNode;
	$scope.growBlueprint = growBlueprint;
	$scope.addSshKey = addSshKey;
	$scope.removeSshKey = removeSshKey;
	$scope.envChanged = envChanged;
	$scope.contChanged = contChanged;
	$scope.getContainers = getContainers;
	$scope.getEnvQuota = getEnvQuota;
	$scope.updateQuota = updateQuota;

	$scope.closePanel = closePanel;

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
				closeOnCancel: false
			},
			function (isConfirm) {
				if (isConfirm) {
					SweetAlert.swal("Deleted!", "Your blueprint has been deleted.", "success");
					console.log(blueprintId);
					environmentService.deleteBlueprint(blueprintId).success(function (data) {
						vm.blueprints.splice(key, 1);
					});
				} else {
					SweetAlert.swal("Cancelled", "Your blueprint is safe :)", "error");
				}
			}
		);
	}

	function showBlueprintCreateBlock(key) {
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

	function addBlueprint() {
		var finalBlueprint = vm.blueprintFrom;
		finalBlueprint.nodeGroups = vm.nodeList;
		if(finalBlueprint.currentNod !== undefined) {
			finalBlueprint.nodeGroups.push(finalBlueprint.currentNode);
		}
		delete finalBlueprint.currentNode;

		environmentService.createBlueprint(JSON.stringify(finalBlueprint)).success(function (data) {
			vm.blueprints.push(data);
		});

		vm.nodeList = [];
		vm.blueprintFrom = {};
	}

	function buildBlueprint(){
		var topology = {};
		for(var i = 0; i < vm.nodesToCreate.length; i++) {
			vm.currentBlueprint.nodeGroups[vm.nodesToCreate[i].parentNode].numberOfContainers = vm.nodesToCreate[i].numberOfContainers;
			if(topology[vm.nodesToCreate[i].peer] === undefined) {
				topology[vm.nodesToCreate[i].peer] = [];
			}
			topology[vm.nodesToCreate[i].peer].push(vm.currentBlueprint.nodeGroups[vm.nodesToCreate[i].parentNode]);
		}

		var postData = 'name=' + vm.currentBlueprint.name;
		postData += '&topology=' + JSON.stringify(topology);
		postData += '&subnet=' + vm.subnetCIDR;
		postData += '&key=null';
		console.log(encodeURI(postData));
		environmentService.buildBlueprint(encodeURI(postData)).success(function (data) {
			console.log(data);
			SweetAlert.swal("Deleted!", "Your environment has been created.", "success");
		}).error(function (error) {
			console.log(error);
			SweetAlert.swal("Cancelled", error.ERROR, "error");
		});
	}

	function addNewNode() {
		if(vm.nodeStatus == 'Add to') {
			var tempNode = vm.blueprintFrom.currentNode;
			vm.blueprintFrom.currentNode = {};
			tempNode.containerPlacementStrategy.criteria = [];
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

	function contChanged(cont) {
		console.log(cont);
		getEnvQuota(cont);
	}

	function envChanged() {
		console.log(this.env.name);
		getContainers(this.env.name);
	}

	function updateQuota() {
		console.log("update quota");
		environmentService.updateQuota().success(function (data) {

		}).error(function () {

		})
	}

	function getEnvQuota(envName) {
		console.log(envName);
		environmentService.getEnvQuota(envName).success(function (data) {
			if (envName == 'Hadoop 1') {
				$scope.envQuota = data[0];
			}
			else if (envName == 'Hadoop 2') {
				$scope.envQuota = data[1];
			}
			else if (envName == 'Cassandra 3') {
				$scope.envQuota = data[2];
			}
			else if (envName == 'Spark 3') {
				$scope.envQuota = data[3];
			}
			else if (envName == 'Spark 2') {
				$scope.envQuota = data[4];
			}
		}).error(function () {

		});
	}

	function getContainers(envName) {
		environmentService.getContainers(envName).success(function (data) {
			$scope.containers=data;
		}).error(function () {

		});
	}

	function destroyEnvironment() {
		SweetAlert.swal({
			title: "Are you sure?",
			text: "Your will not be able to recover this Environment!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, destroy it!",
			cancelButtonText: "No, cancel plx!",
			closeOnConfirm: false,
			closeOnCancel: false },
			function (isConfirm) {
				if (isConfirm) {
					SweetAlert.swal("Destroyed!", "Your environment has been destroyed.", "success");
					environmentService.destroyEnvironment().success(function (data) {

					}).error(function () {

					});
				} else {
					SweetAlert.swal("Cancelled", "Your environment is safe :)", "error");
				}
			});
	}

	function addBlueprintNode() {
		environmentService.addBlueprintNode().success(function (data) {

		}).error(function () {

		});
	}

	function removeEnvironment(){
		SweetAlert.swal({
			title: "Are you sure?",
			text: "Your will not be able to recover this Environment!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, remove it!",
			cancelButtonText: "No, cancel plx!",
			closeOnConfirm: false,
			closeOnCancel: false },
			function (isConfirm) {
				if (isConfirm) {
					SweetAlert.swal("Removed!", "Your environment has been removed.", "success");
					environmentService.removeEnvironments().success(function () {

					}).error(function () {

					})
				} else {
					SweetAlert.swal("Cancelled", "Your environment is safe :)", "error");
				}
			});
	}

	function growBlueprint(){
		environmentService.growBlueprint().success(function () {

		}).error(function () {

		})
	}

	function addSshKey(){
		environmentService.addSshKey().success(function () {

		}).error(function () {

		})
	}

	function removeSshKey(){
		environmentService.removeSshKey().success(function () {

		}).error(function () {

		})
	}
	//// Implementation

	function addPanel(action) {
		jQuery('#resizable-pane').removeClass('fullWidthPane');
		if( action == 'createBlueprint' ) {
			jQuery('#build-blueprint-form').css('display', 'none');
			jQuery('#environment-containers-form').css('display', 'none');
			jQuery('#environment-sshkey-form').css('display', 'none');
			jQuery('#create-blueprint-form').css('display', 'block');
			jQuery('#environment-containers-form').removeClass('animated bounceOutRight bounceInRight');
			jQuery('#environment-sshkey-form').removeClass('animated bounceOutRight bounceInRight');
			jQuery('#build-blueprint-form').removeClass('animated bounceOutRight bounceInRight');
			jQuery('#create-blueprint-form').removeClass('bounceOutRight');
			jQuery('#create-blueprint-form').addClass('animated bounceInRight');
		}
		else if( action == 'buildBlueprint' ) {
			jQuery('#environment-containers-form').css('display', 'none');
			jQuery('#environment-sshkey-form').css('display', 'none');
			jQuery('#create-blueprint-form').css('display', 'none');
			jQuery('#build-blueprint-form').css('display', 'block');
			jQuery('#create-blueprint-form').removeClass('animated bounceOutRight bounceInRight');
			jQuery('#environment-sshkey-form').removeClass('animated bounceOutRight bounceInRight');
			jQuery('#environment-containers-form').removeClass('animated bounceOutRight bounceInRight');
			jQuery('#build-blueprint-form').removeClass('bounceOutRight');
			jQuery('#build-blueprint-form').addClass('animated bounceInRight');
		}
		else if( action == 'envContainers' ) {
			jQuery('#create-blueprint-form').css('display', 'none');
			jQuery('#build-blueprint-form').css('display', 'none');
			jQuery('#environment-sshkey-form').css('display', 'none');
			jQuery('#environment-containers-form').css('display', 'block');
			jQuery('#create-blueprint-form').removeClass('animated bounceOutRight bounceInRight');
			jQuery('#environment-sshkey-form').removeClass('animated bounceOutRight bounceInRight');
			jQuery('#build-blueprint-form').removeClass('animated bounceOutRight bounceInRight');
			jQuery('#environment-containers-form').removeClass('bounceOutRight');
			jQuery('#environment-containers-form').addClass('animated bounceInRight');
		}
		else if( action == 'envSshKey' ) {
			jQuery('#create-blueprint-form').css('display', 'none');
			jQuery('#build-blueprint-form').css('display', 'none');
			jQuery('#environment-containers-form').css('display', 'none');
			jQuery('#environment-sshkey-form').css('display', 'block');
			jQuery('#create-blueprint-form').removeClass('animated bounceOutRight bounceInRight');
			jQuery('#build-blueprint-form').removeClass('animated bounceOutRight bounceInRight');
			jQuery('#environment-containers-form').removeClass('animated bounceOutRight bounceInRight');
			jQuery('#environment-sshkey-form').removeClass('bounceOutRight');
			jQuery('#environment-sshkey-form').addClass('animated bounceInRight');
		}
	}

	function closePanel(action) {
		jQuery('#resizable-pane').addClass('fullWidthPane');
		if( action == 'createBlueprint' ) {
			jQuery('#create-blueprint-form').addClass('bounceOutRight');
			jQuery('#create-blueprint-form').removeClass('animated bounceOutRight bounceInRight');
			jQuery('#create-blueprint-form').css('display', 'none');
		}
		else if( action == 'buildBlueprint' ) {
			jQuery('#build-blueprint-form').addClass('bounceOutRight');
			jQuery('#build-blueprint-form').removeClass('animated bounceOutRight bounceInRight');
			jQuery('#build-blueprint-form').css('display', 'none');
		}
		else if( action == 'envContainers' ) {
			jQuery('#environment-containers-form').addClass('bounceOutRight');
			jQuery('#environment-containers-form').removeClass('animated bounceOutRight bounceInRight');
			jQuery('#environment-containers-form').css('display', 'none');
		}
		else if( action == 'envSshKey' ) {
			jQuery('#environment-sshkey-form').addClass('bounceOutRight');
			jQuery('#environment-sshkey-form').removeClass('animated bounceOutRight bounceInRight');
			jQuery('#environment-sshkey-form').css('display', 'none');
		}
	}

}
