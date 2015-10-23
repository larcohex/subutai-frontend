'use strict';

angular.module('subutai.environment.controller', [])
	.controller('EnvironmentViewCtrl', EnvironmentViewCtrl);

EnvironmentViewCtrl.$inject = ['$scope', 'environmentService', 'SweetAlert'];

function EnvironmentViewCtrl($scope, environmentService, SweetAlert) {

	var vm = this;
	vm.blueprints = {};
	vm.blueprintFrom = {};
	vm.blueprintFrom.currentNode = {};
	vm.templates = [];
	vm.nodeList = [];

	vm.nodeStatus = 'Add to';

	// functions
	vm.addBlueprint = addBlueprint;
	vm.addNewNode = addNewNode;
	vm.setNodeData = setNodeData;
	vm.deleteBlueprint = deleteBlueprint;

	environmentService.getBlueprints().success(function (data) {
		vm.blueprints = data;
	});

	environmentService.getTemplates().success(function (data) {
		vm.templates = data;
	});

	$scope.getBlueprints = getBlueprints;
	$scope.getEnvironments = getEnvironments;
	$scope.removeEnvironment = removeEnvironment;
	$scope.destroyEnvironment = destroyEnvironment;
	$scope.buildBlueprint = buildBlueprint;
	$scope.createBlueprint = createBlueprint;
	$scope.addBlueprintNode = addBlueprintNode;
	$scope.growBlueprint = growBlueprint;
	$scope.addSshKey = addSshKey;
	$scope.removeSshKey = removeSshKey;
	$scope.envChanged = envChanged;
	$scope.contChanged = contChanged;
	$scope.getContainers = getContainers;
	$scope.getEnvQuota = getEnvQuota;
	$scope.updateQuota = updateQuota;

	$scope.addPanel = addPanel;
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

	function getBlueprints() {
		environmentService.getBlueprints().success(function (data) {
			$scope.blueprints = data;
		}).error(function () {
			$scope.status = "Could not get Blueprints";
		});
	}

	function getEnvironments() {
		environmentService.getEnvironments().success(function (data) {
			$scope.environments = data;
		}).error(function () {
			$scope.status = "Could not get Environments";
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

	function buildBlueprint(){
		environmentService.buildBlueprint().success(function () {

		}).error(function () {

		})
	}

	function createBlueprint(){
		environmentService.createBlueprint().success(function () {

		}).error(function () {

		})
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
