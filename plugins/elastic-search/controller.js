'use strict';

angular.module('subutai.plugins.elastic-search.controller', [])
    .controller('ElasticSearchCtrl', ElasticSearchCtrl)
	.directive('colSelectElasticSearchNodes', colSelectElasticSearchNodes);

ElasticSearchCtrl.$inject = ['$scope', 'elasticSearchSrv', 'SweetAlert', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'ngDialog'];

function ElasticSearchCtrl($scope, elasticSearchSrv, SweetAlert, DTOptionsBuilder, DTColumnDefBuilder, ngDialog) {
    var vm = this;
	vm.activeTab = 'install';
	vm.elasticSearchInstall = {};
	vm.clusters = [];
	vm.environments = [];
	vm.containers = [];
	vm.currentCluster = [];
	vm.availableNodes = [];

	//functions
	vm.getClustersInfo = getClustersInfo;	
	vm.addContainer = addContainer;	
	vm.createElasticSearch = createElasticSearch;	
	vm.deleteNode = deleteNode;
	vm.addNodeForm = addNodeForm;
	vm.addNode = addNode;
	vm.deleteCluster = deleteCluster;
	vm.showContainers = showContainers;

	elasticSearchSrv.getEnvironments().success(function (data) {
		vm.environments = data;
	});
	setDefaultValues();

	function showContainers(environmentId) {
		vm.containers = [];
		vm.seeds = [];		
		for(var i in vm.environments) {
			if(environmentId == vm.environments[i].id) {
				for (var j = 0; j < vm.environments[i].containers.length; j++){
					if(vm.environments[i].containers[j].templateName == 'elasticsearch') {
						vm.containers.push(vm.environments[i].containers[j]);
					}
				}
				break;
			}
		}
	}

	function getClusters() {
		elasticSearchSrv.getClusters().success(function (data) {
			vm.clusters = data;
		});
	}
	getClusters();

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

	function getClustersInfo(selectedCluster) {
		LOADING_SCREEN();
		elasticSearchSrv.getClusters(selectedCluster).success(function (data) {
			vm.currentCluster = data;
			LOADING_SCREEN('none');
		});
	}

	function addNodeForm() {
		if(vm.currentCluster.clusterName === undefined) return;
		elasticSearchSrv.getAvailableNodes(vm.currentCluster.clusterName).success(function (data) {
			vm.availableNodes = data;
			console.log(vm.availableNodes);
		});
		ngDialog.open({
			template: 'plugins/elastic-search/partials/addNodesForm.html',
			scope: $scope
		});
	}

	function addNode(chosenNode) {
		if(chosenNode === undefined) return;
		if(vm.currentCluster.clusterName === undefined) return;
		SweetAlert.swal("Success!", "Adding node action started.", "success");
		ngDialog.closeAll();
		elasticSearchSrv.addNode(vm.currentCluster.clusterName, chosenNode).success(function (data) {
			SweetAlert.swal(
				"Success!",
				"Node has been added on cluster " + vm.currentCluster.clusterName + ".",
				"success"
			);
			getClustersInfo(vm.currentCluster.clusterName);
		});
	}

	function createElasticSearch() {
		if(vm.elasticSearchInstall.clusterName === undefined || vm.elasticSearchInstall.clusterName.length == 0) return;
		if(vm.elasticSearchInstall.environmentId === undefined) return;

		SweetAlert.swal("Success!", "Elastic Search cluster start creating.", "success");
		elasticSearchSrv.createElasticSearch(vm.elasticSearchInstall).success(function (data) {
			SweetAlert.swal("Success!", "Your Elastic Search cluster start creating.", "success");
			getClusters();
		}).error(function (error) {
			SweetAlert.swal("ERROR!", 'Elastic Search cluster create error: ' + error, "error");
		});
		setDefaultValues();
		vm.activeTab = 'manage';
	}

	function deleteCluster() {
		if(vm.currentCluster.clusterName === undefined) return;
		SweetAlert.swal({
			title: "Are you sure?",
			text: "Your will not be able to recover this cluster!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#ff3f3c",
			confirmButtonText: "Delete",
			cancelButtonText: "Cancel",
			closeOnConfirm: false,
			closeOnCancel: true,
			showLoaderOnConfirm: true
		},
		function (isConfirm) {
			if (isConfirm) {
				elasticSearchSrv.deleteCluster(vm.currentCluster.clusterName).success(function (data) {
					SweetAlert.swal("Deleted!", "Cluster has been deleted.", "success");
					vm.currentCluster = {};
					getClusters();
				}).error(function(data){
					SweetAlert.swal("ERROR!", 'Delete cluster error: ' + data, "error");
				});
			}
		});
	}

	function deleteNode(nodeId) {
		if(vm.currentCluster.clusterName === undefined) return;
		SweetAlert.swal({
			title: "Are you sure?",
			text: "Your will not be able to recover this node!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#ff3f3c",
			confirmButtonText: "Delete",
			cancelButtonText: "Cancel",
			closeOnConfirm: false,
			closeOnCancel: true,
			showLoaderOnConfirm: true
		},
		function (isConfirm) {
			if (isConfirm) {
				elasticSearchSrv.deleteNode(vm.currentCluster.clusterName, nodeId).success(function (data) {
					SweetAlert.swal("Deleted!", "Node has been deleted.", "success");
					vm.currentCluster = {};
				});
			}
		});
	}

	function addContainer(containerId) {
		if(vm.elasticSearchInstall.nodes.indexOf(containerId) > -1) {
			vm.elasticSearchInstall.nodes.splice(vm.elasticSearchInstall.nodes.indexOf(containerId), 1);
		} else {
			vm.elasticSearchInstall.nodes.push(containerId);
		}
	}

	function setDefaultValues() {
		vm.elasticSearchInstall = {};
		vm.elasticSearchInstall.nodes = [];
	}

}

function colSelectElasticSearchNodes() {
	return {
		restrict: 'E',
		templateUrl: 'plugins/elastic-search/directives/col-select/col-select-containers.html'
	}
};

