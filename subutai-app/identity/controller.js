'use strict';

angular.module('subutai.identity.controller', [])
.controller('IdentityCtrl', IdentityCtrl)

IdentityCtrl.$inject = ['identitySrv', 'DTOptionsBuilder', 'DTColumnBuilder', '$resource', '$compile', 'SweetAlert'];

function IdentityCtrl(identitySrv, DTOptionsBuilder, DTColumnBuilder, $resource, $compile, SweetAlert) {
	var vm = this;
	vm.person2Add = {};

	vm.addPane = addPane;
	vm.closePane = closePane;
	vm.addUser = addUser;
	vm.editUser = editUser;
    vm.deleteUser = deleteUser;

	vm.isUser = true;
	vm.isRole = false;

	/*identitySrv.getUsers().success(function (data) {
		vm.users = data;
	});*/

	identitySrv.getRoles().success(function (data) {
		vm.roles = data;
	});

    vm.dtInstance = {};
    vm.users = {};
	vm.dtOptions = DTOptionsBuilder.fromSource('http://172.16.131.205:8181/cxf/identity_ui/')
		.withPaginationType('full_numbers')
		.withOption('createdRowUser', createdRowUser);
	vm.dtColumns = [
		DTColumnBuilder.newColumn('id').withTitle('ID'),
		DTColumnBuilder.newColumn('username').withTitle('Username'),
		DTColumnBuilder.newColumn('fullname').withTitle('Full name'),
		DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
			.renderWith(actionsHtml)
    ];

    function createdRowUser(row, data, dataIndex) {
		$compile(angular.element(row).contents())($scope);
    }

    function actionsHtml(data, type, full, meta) {
		vm.users[data.id] = data;
		return '<button class="btn btn-warning" ng-click="identityCtrl.editUser(identityCtrl.users[' + data.id + '])">' +
			'   <i class="fa fa-edit"></i>' +
			'</button>&nbsp;' +
			'<button class="btn btn-danger" ng-click="identityCtrl.deleteUser(identityCtrl.users[' + data.id + '])">' +
			'   <i class="fa fa-trash-o"></i>' +
			'</button>';
    }	

	function addUser() {
		//vm.users.push(angular.copy(vm.person2Add));
		var currentUserRoles = JSON.stringify(vm.person2Add.roles);
		var postData = 'username=' + vm.person2Add.username + 
			'&full_name=' + vm.person2Add.username +
			'&password=' + vm.person2Add.fullname +
			'&email=' + vm.person2Add.email +
			'&roles=' + currentUserRoles;

		if(vm.person2Add.id !== undefined && vm.person2Add.id > 0) {
			postData += '&user_id=' + vm.person2Add.id;
		}

		identitySrv.addUser(postData).success(function (data) {
			vm.dtInstance.reloadData();
		});
	}

    function editUser(user) {
		vm.message = 'You are trying to edit the row: ' + JSON.stringify(user);
		vm.person2Add = user;
		addPane();
    }

    function deleteUser(user) {
		vm.message = 'You are trying to remove the row: ' + JSON.stringify(user);
		vm.dtInstance.reloadData();
		SweetAlert.swal(
			{
				title: "Are you sure?",
				text: "Your will not be able to recover this user!",
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
					SweetAlert.swal("Deleted!", "User has been deleted.", "success");
					identitySrv.deleteUser(user.id).success(function (data) {
						vm.dtInstance.reloadData();
					});
				} else {
					SweetAlert.swal("Cancelled", "User is safe :)", "error");
				}
			}
		);
    }

	//// Implementation

	function addPane(z) {
		jQuery('#resizable-pane').removeClass('fullWidthPane');
		if( vm.isUser ) {
			jQuery('#role-form').css('display', 'none');
			jQuery('#user-form').css('display', 'block');
			jQuery('#role-form').removeClass('animated bounceOutRight bounceInRight');
			jQuery('#user-form').removeClass('bounceOutRight');
			jQuery('#user-form').addClass('animated bounceInRight');
		}
		else if( vm.isRole ) {
			jQuery('#user-form').css('display', 'none');
			jQuery('#role-form').css('display', 'block');
			jQuery('#user-form').removeClass('animated bounceOutRight bounceInRight');
			jQuery('#role-form').removeClass('bounceOutRight');
			jQuery('#role-form').addClass('animated bounceInRight');
		}
	}

	function closePane() {
		jQuery('#resizable-pane').addClass('fullWidthPane');
		if( vm.isUser ) {
			jQuery('#user-form').addClass('bounceOutRight');
			jQuery('#user-form').removeClass('animated bounceOutRight bounceInRight');
			jQuery('#user-form').css('display', 'none');
		}
		else if( vm.isRole ) {
			jQuery('#role-form').addClass('bounceOutRight');
			jQuery('#role-form').removeClass('animated bounceOutRight bounceInRight');
			jQuery('#role-form').css('display', 'none');
		}
	}
}

