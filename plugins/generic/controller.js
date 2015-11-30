'use strict';

angular.module('subutai.plugins.generic.controller', [])
    .controller('GenericCtrl', GenericCtrl)

GenericCtrl.$inject = ['$scope', 'genericSrv', 'SweetAlert', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'ngDialog'];

function GenericCtrl($scope, genericSrv, SweetAlert, DTOptionsBuilder, DTColumnDefBuilder, ngDialog) {
    var vm = this;
	vm.activeTab = 'create';
	vm.profiles = [];
	vm.currentProfile = "";
	vm.operations = [];
	vm.newProfile = "";

	vm.createProfile = createProfile;
	vm.deleteProfile = deleteProfile;
	vm.changeToConfigure = changeToConfigure;

	vm.addOperationWindow = addOperationWindow;



	// Init

	genericSrv.listProfiles().success (function (data) {
		vm.profiles = data;
		console.log (data);
		vm.currentProfile = vm.profiles[0];
		genericSrv.listOperations (vm.currentProfile).success (function (data) {
			vm.operations = data;
		}
	});


	// Create

	function createProfile() {
		if (vm.profiles.indexOf (vm.newProfile) > -1) {
			SweetAlert.swal("ERROR!", 'Profile already exists', "error");
		}
		else {
			genericSrv.saveProfile (vm.newProfile).success (function (data) {
				SweetAlert.swal("Success!", "Your profile was created.", "success");
				vm.profiles.push (vm.newProfile);
				vm.newProfile = "";
			}).error (function (error) {
				SweetAlert.swal("ERROR!", 'Profile create error: ' + error.replace(/\\n/g, ' '), "error");
			});
		}
	}


	function deleteProfile (profile) {
		genericSrv.deleteProfile (profile).success (function (data) {
			SweetAlert.swal("Success!", "Your profile was deleted.", "success");
			vm.profiles.push (vm.newProfile);
			vm.newProfile = "";
		}).error (function (error) {
			SweetAlert.swal("ERROR!", 'Profile delete error: ' + error.replace(/\\n/g, ' '), "error");
		});
	}


	function changeToConfigure (profile) {
		vm.currentProfile = profile;
		vm.activeTab = "configure";
	}


	// Configure

	function getOperations() {
		if (vm.currentProfile = "") {
			SweetAlert.swal("ERROR!", 'Please select profile', "error");
		}
		else {
			genericSrv.listOperations (vm.currentProfile)
		}
	}


	function addOperationWindow() {
		ngDialog.open({
			template: 'plugins/generic/partials/addOperation.html',
			scope: $scope
		});
	}

}

