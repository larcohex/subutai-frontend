'use strict';

angular.module('subutai.containers.controller', [])
	.controller('ContainerViewCtrl', ContainerViewCtrl);

ContainerViewCtrl.$inject = ['$scope', 'environmentService', 'SweetAlert', 'DTOptionsBuilder', 'DTColumnBuilder', '$resource', '$compile',];

function ContainerViewCtrl($scope, environmentService, SweetAlert, DTOptionsBuilder, DTColumnBuilder, $resource, $compile) {

	var vm = this;
	vm.environments = [];

	// functions
	vm.getEnvironments = getEnvironments;
	vm.showContainersList = showContainersList;
	vm.destroyContainer = destroyContainer;

	function getEnvironments() {
		environmentService.getEnvironments().success(function (data) {
			vm.environments = data;
		});
	}

	getEnvironments();

	vm.dtInstance = {};
	vm.users = {};
	vm.dtOptions = DTOptionsBuilder
		.fromFnPromise(function() {
			return $resource(serverUrl + 'environments_ui/').query().$promise;
		}).withPaginationType('full_numbers')
		.withOption('createdRow', createdRow)
		.withOption('order', [[ 1, "asc" ]])
		//.withDisplayLength(2)
		.withOption('stateSave', true);

	vm.dtColumns = [
		//DTColumnBuilder.newColumn('id').withTitle('ID'),
		DTColumnBuilder.newColumn(null).withTitle('').notSortable().renderWith(statusHTML),
		DTColumnBuilder.newColumn('name').withTitle('Environment name'),
		DTColumnBuilder.newColumn(null).withTitle('').renderWith(containersTags),
		DTColumnBuilder.newColumn(null).withTitle('').notSortable().renderWith(actionDelete)
	];

	function createdRow(row, data, dataIndex) {
		$compile(angular.element(row).contents())($scope);
	}

	function statusHTML(data, type, full, meta) {
		vm.users[data.id] = data;
		return '<div class="b-status-icon b-status-icon_' + data.status + '" title="' + data.status + '"></div>';
	}

	function containersTags(data, type, full, meta) {
		var containersHTML = '';
		for(var i = 0; i < data.containers.length; i++) {
			containersHTML += '<span class="b-tags b-tags_' + quotaColors[data.containers[i].type] + '">' 
				+ data.containers[i].templateName 
				+ ' <a href ng-click="environmentViewCtrl.destroyContainer(\'' + data.containers[i].id + '\')"><i class="fa fa-times"></i></a>' 
			+ '</span>';
		}
		return containersHTML;
	}

	function actionDelete(data, type, full, meta) {
		return '<a href="" class="b-icon b-icon_remove" ng-click="environmentViewCtrl.destroyEnvironment(\'' + data.id + '\')"></a>';
	}

	function destroyContainer(containerId) {
		SweetAlert.swal({
			title: "Are you sure?",
			text: "Your will not be able to recover this Container!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, destroy it!",
			cancelButtonText: "No, cancel plx!",
			closeOnConfirm: false,
			closeOnCancel: false,
			showLoaderOnConfirm: true
		},
		function (isConfirm) {
			if (isConfirm) {
				environmentService.destroyContainer(containerId).success(function (data) {
					SweetAlert.swal("Destroyed!", "Your container has been destroyed.", "success");
					vm.dtInstance.reloadData(null, false);
				}).error(function (data) {
					SweetAlert.swal("ERROR!", "Your environment is safe :). Error: " + data.ERROR, "error");
				});
			} else {
				SweetAlert.swal("Cancelled", "Your container is safe :)", "error");
			}
		});
	}

	function showContainersList(key) {
		vm.containers = vm.environments[key].containers;
	}

	function getContainers() {
		var environment = vm.environments[vm.environmentQuota];
		vm.containersForQuota = environment.containers;
	}

}
