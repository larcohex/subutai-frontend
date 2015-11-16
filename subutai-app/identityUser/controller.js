'use strict';

angular.module('subutai.identity-user.controller', [])
	.controller('IdentityUserCtrl', IdentityUserCtrl)
	.directive('pwCheck', pwCheck)
	.directive('colSelect', colSelect);	

IdentityUserCtrl.$inject = ['$scope', 'identitySrv', 'DTOptionsBuilder', 'DTColumnBuilder', '$resource', '$compile', 'SweetAlert'];

function IdentityUserCtrl($scope, identitySrv, DTOptionsBuilder, DTColumnBuilder, $resource, $compile, SweetAlert) {

	var vm = this;
	vm.user2Add = {};
	vm.editUserName = true;

	//functions
	vm.addUser = addUser;
	vm.editUser = editUser;
	vm.deleteUser = deleteUser;
	vm.colSelectUserRole = colSelectUserRole;
	vm.removeRoleFromUser = removeRoleFromUser;

	vm.dtInstance = {};
	vm.users = {};
	vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
		return $resource( serverUrl + 'identity_ui/').query().$promise;
	}).withPaginationType('full_numbers').withOption('createdRow', createdRow);
	vm.dtColumns = [
		//DTColumnBuilder.newColumn('id').withTitle('ID'),
		DTColumnBuilder.newColumn(null).withTitle('').notSortable().renderWith(actionEdit),
		DTColumnBuilder.newColumn('userName').withTitle('Username'),
		DTColumnBuilder.newColumn('fullName').withTitle('Full name'),
		DTColumnBuilder.newColumn('email').withTitle('Email'),
		DTColumnBuilder.newColumn(null).withTitle('Roles').notSortable().renderWith(rolesTags),
		DTColumnBuilder.newColumn(null).withTitle('').notSortable().renderWith(actionDelete)
	];

	function getRolesFromAPI() {
		identitySrv.getRoles().success(function (data) {
			vm.roles = data;
		});
	}
	getRolesFromAPI();

	function createdRow(row, data, dataIndex) {
		$compile(angular.element(row).contents())($scope);
	}

	function actionEdit(data, type, full, meta) {
		vm.users[data.id] = data;
		return '<a href class="b-icon b-icon_edit" ng-click="identityUserCtrl.editUser(identityUserCtrl.users[' + data.id + '])"></a>';
	}

	function rolesTags(data, type, full, meta) {
		//vm.users[data.id] = data;
		var rolesHTML = '';
		for(var i = 0; i < data.roles.length; i++) {
			rolesHTML += '<span class="b-tags b-tags_grey">' 
				+ data.roles[i].name 
				+ ' <a href ng-click="identityUserCtrl.removeRoleFromUser(identityUserCtrl.users[' + data.id + '], ' + i + ')"><i class="fa fa-times"></i></a>' 
			+ '</span>';
		}
		return rolesHTML;
	}

	function actionDelete(data, type, full, meta) {
		//vm.users[data.id] = data;
		return '<a href class="b-icon b-icon_remove" ng-click="identityUserCtrl.deleteUser(identityUserCtrl.users[' + data.id + '])"></a>';
	}

	function userPostData(user) {
		var currentUserRoles = JSON.stringify(user.roles);
		var postData = 'username=' + user.userName + 
			'&full_name=' + user.fullName +
			'&password=' + user.password +
			'&email=' + user.email;

		if(currentUserRoles !== undefined) {
			postData += '&roles=' + currentUserRoles;
		}

		if(user.id !== undefined && user.id > 0) {
			postData += '&user_id=' + user.id;
		}

		return postData;
	}

	function addUser() {
		//vm.users.push(angular.copy(vm.person2Add));
		if ($scope.addUserForm.$valid) {
			var postData = userPostData(vm.user2Add);
			identitySrv.addUser(postData).success(function (data) {
				vm.dtInstance.reloadData();
			});
			$scope.addUserForm.$setPristine();
			$scope.addUserForm.$setUntouched();
		}		
	}

	function colSelectUserRole(id) {

		if(vm.user2Add.roles === undefined) {
			vm.user2Add.roles = [];
		}

		if(vm.user2Add.roles.indexOf(id) >= 0) {
			vm.user2Add.roles.splice(vm.user2Add.roles.indexOf(id), 1);
		} else {
			vm.user2Add.roles.push(id);
		}
		console.log(vm.user2Add.roles);
	}

	function editUser(user) {
		//vm.message = 'You are trying to edit the row: ' + JSON.stringify(user);
		vm.editUserName = false;
		vm.user2Add = angular.copy(user);
		vm.user2Add.confirm_password = angular.copy(vm.user2Add.password);
		vm.user2Add.roles = [];
		for(var i = 0; i < user.roles.length; i++) {
			vm.user2Add.roles.push(user.roles[i].id);
		}
	}

	function removeRoleFromUser(user, roleKey) {
		SweetAlert.swal({
			title: "Are you sure?",
			text: 'Remove "' + user.roles[roleKey].name + '" role from user!',
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, remove it!",
			cancelButtonText: "No, cancel!",
			closeOnConfirm: false,
			closeOnCancel: false,
			showLoaderOnConfirm: true
		},
		function (isConfirm) {
			if (isConfirm) {
				user.roles.splice(roleKey, 1);
				var userRoles = [];
				for(var i = 0; i < user.roles.length; i++) {
					userRoles.push(user.roles[i].id);
				}
				user.roles = userRoles;
				var postData = userPostData(user);
				console.log(postData);
				identitySrv.addUser(postData).success(function (data) {
					SweetAlert.swal("Removed!", "Role has been removed.", "success");
					vm.dtInstance.reloadData();
				}).error(function (data) {
					SweetAlert.swal("ERROR!", "User role is safe :). Error: " + data, "error");
				});
			} else {
				SweetAlert.swal("Cancelled", "User role is safe :)", "error");
			}
		});
	}

	function deleteUser(user) {
		SweetAlert.swal({
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
				identitySrv.deleteUser(user.id).success(function (data) {
					SweetAlert.swal("Deleted!", "User has been deleted.", "success");
					vm.dtInstance.reloadData();
				}).error(function (data) {
					SweetAlert.swal("ERROR!", "User is safe :). Error: " + data, "error");
				});
			} else {
				SweetAlert.swal("Cancelled", "User is safe :)", "error");
			}
		});
	}
};

function pwCheck() {
	return {
		require: 'ngModel',
		link: function (scope, elem, attrs, ctrl) {
			var firstPassword = '#' + attrs.pwCheck;
			elem.add(firstPassword).on('keyup', function () {
				scope.$apply(function () {
					ctrl.$setValidity('pwmatch', elem.val() === $(firstPassword).val());
				});
			});
		}
	}
};

function colSelect() {
	return {
		restrict: 'E',
		templateUrl: 'subutai-app/identityUser/directives/col-select/col-select-roles.html'
	}
};

