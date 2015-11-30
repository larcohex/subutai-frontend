"use strict";

angular.module("subutai.plugins.generic.controller", [])
    .controller("GenericCtrl", GenericCtrl)

GenericCtrl.$inject = ["$scope", "genericSrv", "SweetAlert", "DTOptionsBuilder", "DTColumnDefBuilder", "ngDialog"];

fileModel.$inject = ["$parse"];
var fileUploader = {};
function GenericCtrl($scope, genericSrv, SweetAlert, DTOptionsBuilder, DTColumnDefBuilder, ngDialog) {
    var vm = this;
	vm.activeTab = "create";
	vm.profiles = [];
	vm.currentProfile = "";
	vm.operations = [];
	vm.newProfile = "";
	vm.newOperation = {
		cwd: "/",
		timeout: "30",
		daemon: false,
		script: false
	};
	vm.currentOperation = {};
	vm.environments = [];
	vm.templates = [];
	vm.currentEnvironment = {};
	vm.currentTemplate = "";
	vm.currentOperationName = "";
	vm.previousName = "";

	vm.createProfile = createProfile;
	vm.deleteProfile = deleteProfile;
	vm.changeToConfigure = changeToConfigure;

	vm.getOperations = getOperations;
	vm.addOperationWindow = addOperationWindow;
	vm.operationInfo = operationInfo;
	vm.saveOperation = saveOperation;
	vm.editOperation = editOperation;
	vm.updateOperation = updateOperation;
	vm.deleteOperation = deleteOperation;

	vm.executeOperation = executeOperation;
	vm.updateEnvironment = updateEnvironment;
	vm.output = "";

	// Init

	genericSrv.listProfiles().success (function (data) {
		vm.profiles = data;
		vm.currentProfile = vm.profiles[0];
		genericSrv.listOperations (vm.currentProfile).success (function (data) {
			vm.operations = data;
			for (var i = 0; i < vm.operations.length; ++i) {
				vm.operations[i].commandName = window.atob (vm.operations[i].commandName);
			}
			vm.currentOperation = vm.operations[0];
		});
	});

	var getTemplates = function() {
		vm.templates = [];
		for (var i = 0; i < vm.currentEnvironment.containers.length; ++i) {
			if (!(vm.templates.indexOf (vm.currentEnvironment.containers[i].templateName) > -1)) {
				vm.templates.push (vm.currentEnvironment.containers[i].templateName);
			}
		}
		console.log (vm.templates);
		vm.currentTemplate = vm.templates[0];
	};

	genericSrv.getEnvironments().success (function (data) {
		vm.environments = data;
		console.log (vm.environments);
		vm.currentEnvironment = vm.environments[0];
		getTemplates();
		if (vm.environments.length === 0) {
			SweetAlert.swal ("ERROR!", "Please create environment first", "error");
		}
	}).error (function (error) {
		SweetAlert.swal ("ERROR!", "Environments error: " + error.replace(/\\n/g, " "), "error");
	});

	// Create

	function createProfile() {
		if (vm.profiles.indexOf (vm.newProfile) > -1) {
			SweetAlert.swal ("ERROR!", "Profile already exists", "error");
		}
		else {
			genericSrv.saveProfile (vm.newProfile).success (function (data) {
				SweetAlert.swal ("Success!", "Your profile was created.", "success");
				vm.profiles.push (vm.newProfile);
				vm.newProfile = "";
			}).error (function (error) {
				SweetAlert.swal ("ERROR!", "Profile create error: " + error.replace(/\\n/g, " "), "error");
			});
		}
	}


	function deleteProfile (profile) {
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
				genericSrv.deleteProfile (profile).success (function (data) {
					SweetAlert.swal ("Success!", "Your profile was deleted.", "success");
					vm.profiles.splice (vm.profiles.indexOf (vm.currentProfile), 1);
				}).error (function (error) {
					SweetAlert.swal ("ERROR!", "Profile delete error: " + error.replace(/\\n/g, " "), "error");
				});
			}
		});
	}


	function changeToConfigure (profile) {
		vm.currentProfile = profile;
		vm.activeTab = "configure";
	}


	// Configure

	function getOperations() {
		if (vm.currentProfile === "") {
			SweetAlert.swal ("ERROR!", "Please select profile", "error");
		}
		else {
			genericSrv.listOperations (vm.currentProfile).success (function (data) {
				vm.operations = data;
				getTemplates();
				for (var i = 0; i < vm.operations.length; ++i) {
					vm.operations[i].commandName = window.atob (vm.operations[i].commandName);
				}
				vm.currentOperation = vm.operations[0];
			});
		}
	}


	function addOperationWindow() {
		var id = ngDialog.open ({
			template: "plugins/generic/partials/addOperation.html",
			scope: $scope
		}).id;
/*		$scope.$on('ngDialog.opened', function (e, $dialog) {;
            document.getElementById ("upload").addEventListener ("change", readScript, false);
        });*/
	}


	function operationInfo (operation) {
		vm.currentOperation = operation;
		ngDialog.open ({
			template: "plugins/generic/partials/viewOperation.html",
			scope: $scope
		});
	}


	function checkIfExists(operation) {
		var arr = [];
		for (var i = 0; i < vm.operations.length; ++i) {
			arr.push (vm.operations.operationName);
		}
		if (arr.indexOf (operation.operationName) > -1) {
			return true;
		}
		return false;
	}


	function saveOperation() {
		if (checkIfExists (vm.newOperation)) {
			SweetAlert.swal ("ERROR!", "Operation already exists", "error");
		}
		else {
			var file = fileUploader;
			genericSrv.saveOperation (vm.currentProfile, vm.newOperation, file).success (function (data) {
				SweetAlert.swal ("Success!", "Your operation was created.", "success");
				vm.operations.push (vm.newOperation);
				vm.newOperation = {
					cwd: "/",
					timeout: "30",
					daemon: false,
					script: false
				};
				ngDialog.closeAll();
			}).error (function (error) {
				SweetAlert.swal ("ERROR!", "Operation create error: " + error.replace(/\\n/g, " "), "error");
			});
		}
	}


	function editOperation (operation) {
		vm.currentOperation = operation;
		vm.previousName = vm.currentOperation.operationName;
		ngDialog.open ({
			template: "plugins/generic/partials/editOperation.html",
			scope: $scope
		});
/*		$scope.$on('ngDialog.opened', function (e, $dialog) {
			document.getElementById ("upload").addEventListener ("change", readScript, false);
		});*/
	}

	function updateOperation() {
		if (vm.previousName !== vm.currentOperation.operationName) {
			if (checkIfExists (vm.currentOperation)) {
				SweetAlert.swal ("ERROR!", "Operation already exists", "error");
				return;
			}
		}
		genericSrv.updateOperation (vm.currentOperation).success (function (data) {
			SweetAlert.swal ("Success!", "Your operation was updated.", "success");
			for (var i = 0; i < vm.operations.length; ++i) {
				if (vm.operations[i].operationName === vm.previousName) {
					vm.operations.splice (i, 1);
					vm.operations.push (vm.currentOperation, i);
					break;
				}
			}
			ngDialog.closeAll();
		}).error (function (error) {
			SweetAlert.swal ("ERROR!", "Operation update error: " + error.replace(/\\n/g, " "), "error");
		});
	}

	function deleteOperation (operationId) {
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
				genericSrv.deleteOperation (operationId).success (function (data) {
					SweetAlert.swal ("Success!", "Your operation was deleted.", "success");
					vm.operations.splice (vm.profiles.indexOf (vm.currentOperation), 1);
					ngDialog.closeAll();
				}).error (function (error) {
					SweetAlert.swal ("ERROR!", "Operation delete error: " + error.replace(/\\n/g, " "), "error");
				});
			}
		});
	}


	function readScript (e) {
    	var file = e.target.files[0];
    	if (!file) {
    		vm.newOperation.commandName = "";
    	}
    	var reader = new FileReader();
    	reader.onload = function (e) {
    		vm.newOperation.commandName = e.target.result;
    		vm.newOperation.script = true;
    	};
    	reader.readAsText (file);
    }



	// Manage


	function executeOperation (container) {
		vm.output = "";
		for (var i = 0; i < vm.operations.length; ++i) {
			if (vm.operations[i].operationName === vm.currentOperationName) {
				vm.currentOperation = vm.operations[i];
				break;
			}
		}
		genericSrv.executeOperation (vm.currentOperation.operationName, container.hostname, vm.currentEnvironment.id).success (function (data) {
			console.log ("!");
			vm.output = data;
		}).error (function (error) {
			SweetAlert.swal ("ERROR!", "Operation execute error: " + error.replace(/\\n/g, " "), "error");
		});
	}


	function updateEnvironment(environmentId) {
		console.log ("!");
		for (var i = 0; i < vm.environments.length; ++i) {
			if (vm.environments[i].environmentId === environmentId) {
				vm.currentEnvironment = vm.environments[i];
				vm.getOperations();
				break;
			}
		}
	}
}

function fileModel($parse) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function(){
				document.getElementById("upload").value = element[0].files[0].name;
				scope.$apply(function(){
					modelSetter(scope, element[0].files[0]);
					fileUploader = element[0].files[0];
				});
			});
		}
	};
}