/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


'use strict';

angular.module('subutai.plugins.appscale.controller', ['ngDroplet'])
        .controller('AppscaleCtrl', AppscaleCtrl)
        .directive('colSelectAppscaleContainers', colSelectAppscaleContainers)
        .directive('checkboxListDown', checkboxListDown);

AppscaleCtrl.$inject = ['appscaleSrv', 'SweetAlert', 'DTOptionsBuilder', 'DTColumnDefBuilder', '$scope', 'ngDialog'];

var file = {};

function AppscaleCtrl (appscaleSrv, SweetAlert, DTOptionsBuilder, DTColumnDefBuilder, $scope, ngDialog) {
	var vm = this;
    vm.activeTab = 'install';
    vm.appscaleInstall = [];
    vm.environments = [];
    vm.containers = [];
    vm.clusters = [];

    // functions...
    
//    vm.getClusters = getClusters;
    vm.configureClusters = configureCluster;
    vm.uninstallCluster = uninstallCluster;
    
    setDefaultValues ();
    
/*    appscaleSrv.getEnvironments().success( function (data) {
        vm.environments = data;
        console.log (vm.environments);
    } );*/
    
/*    function getClusters () {
        appscaleSrv.listClusters().success ( function (data) {
            vm.clusters = data;
        } );
    }
    
    getClusters();*/
    
    function configureCluster () {
        SweetAlert.swal ("Success !", "Appscale installation is being created.", "success");
        vm.activeTab = "manage";
        appscaleSrv.configureCluster(JSON.stringify(vm.appscaleInstall)).success(function (data) {
            SweetAlert.swal("Success!", "Appscale create message"+ data.replace(/\\n/g, ''), "success" );
//            getClusters();
        } ).error ( function (error) {
            SweetAlert.swal("ERROR!", 'Appscale cluster creation error: ' + error.replace(/\\n/g, ' '), "error");
//            getClusters();
        } );
        setDefaultValues();
    }
    
    function uninstallCluster () {
        if (vm.currentCluster.clusterName === undefined) return;
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
                    appscaleSrv.uninstallCluster(vm.currentCluster.clusterName).success(function (data) {
                        SweetAlert.swal("Deleted!", "Cluster has been deleted.", "success");
                        vm.currentCluster = {};
//                        getClusters();
                    });
                }
            });
    }
    
    function setDefaultValues() {
        vm.appscaleInstall = {};
        vm.appscaleInstall.domainName = 'intra.lan';
    }


    vm.uploadPackage = uploadPackage;
	// TODO: take container id and deploy on it
    function uploadPackage() {
		ngDialog.open ({
			template: "plugins/appscale/partials/upload.html",
			scope: $scope
		});
		$scope.$on('ngDialog.opened', function (e, $dialog) {
			var holder = document.getElementById('holder');

			holder.ondragover = function () { this.innerHTML = "+"; return false; };
			holder.ondragend = function () { this.innerHTML = "Drop package here"; return false; };
			holder.ondrop = function (e) {
				readPackage (e, holder);
				return false;
			};
			document.getElementById ("uploadBtn").addEventListener ("change", readPackage, false);
		});
    }
    function readPackage (e, holder) {
    	this.innerHTML = "";
        this.style.backgroundImage = "url(plugins/appscale/loading.gif)"
		e.preventDefault();
		// TODO: design moar
		if (e.dataTransfer !== undefined) {
			file = e.dataTransfer.files[0];
		}
		else {
			file = e.target.files[0];
		}
		var reader = new FileReader();
		reader.onload = function (event) {
			if (file.type != "application/x-tar" && file.type != "application/zip" && file.type != "application/gzip" && file.type != "application/x-rar-compressed") {
				holder.innerHTML = "Wrong file type";
				holder.style.backgroundImage = "";
			}
			else {
				console.log (file);
				/*appscaleSrv.sendPackage (file).success (function (data) {
                	*/ngDialog.closeAll();/*
                	TODO: update info, show applications, show address for application reach
                }).error (function (error) {
                	TODO: alert about error
                });*/
			}
		};
		reader.readAsDataURL(file);
    }
};
function colSelectAppscaleContainers() {
    return {
        restrict: 'E',
        templateUrl: 'plugins/appscale/directives/col-select/col-select-containers.html'
    };
};
function checkboxListDown() {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            $(".b-form-input_dropdown").click(function () {
                $(this).toggleClass("is-active");
            });

            $(".b-form-input-dropdown-list").click(function (e) {
                e.stopPropagation();
            });
        }
    };
};
