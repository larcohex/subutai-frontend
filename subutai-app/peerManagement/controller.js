'use strict';

angular.module('subutai.peerManagement.controller', [])
    .controller('PeerManagementViewCtrl', PeerManagementViewCtrl);

PeerManagementViewCtrl.$inject = ['$scope', 'peerManagementService'];

function PeerManagementViewCtrl($scope, peerManagementService) {
    $scope.getResourceHosts = getResourceHosts;
    $scope.getAllContainers = getAllContainers;
    $scope.getContainer = getContainer;
    $scope.stopContainer = stopContainer;
    $scope.startContainer = startContainer;
    $scope.checkContainer = checkContainer;
    $scope.destroyContainer = destroyContainer;

    $scope.resourceHosts = [];
    $scope.containers = [];

    $scope.test = ". TEST_TEST_TEST .";

    getAllContainers();
    getResourceHosts();

    function getAllContainers() {
        peerManagementService.getAllContainers().success(function (data) {
            $scope.containers = data;
        }).error(function () {
            $scope.status = "Could not get all containers";
        });
    }

    function getResourceHosts() {
        peerManagementService.getResourceHosts().success(function (data) {
            $scope.resourceHosts = data;

            //var selectOpt = document.getElementById('selectResourceHost'),
            //    df = document.createDocumentFragment();
            //for (var i = 0; i < data.length; i++) {
            //    var option = document.createElement('option');
            //    option.value = data[i].id;
            //    option.appendChild(document.createTextNode(data[i].name));
            //    df.appendChild(option);
            //}
            //selectOpt.appendChild(df);
            //
            //$(document).ready(function () {
            //    $("select").selectr({
            //        title: 'Select Resource host',
            //        placeholder: 'Search Resource hosts'
            //    });
            //});

        }).error(function () {
            $scope.status = "Could not get Resource hosts";
        });
    }

    function getContainer() {
        peerManagementService.getContainer(this.rHost).success(function (data) {
            $scope.containers = data;
        });
    }

    function stopContainer(id) {
        peerManagementService.stopContainer(id).success(function (data) {
            $scope.containers = data;
        });
    }

    function startContainer(id) {
        peerManagementService.startContainer(id).success(function (data) {
            $scope.containers = data;
        });
    }

    function checkContainer(id) {
        peerManagementService.checkContainer(id).success(function (data) {
            $scope.containers = data;
        });
    }

    function destroyContainer(id) {
        peerManagementService.destroyContainer(id).success(function (data) {
            $scope.containers = data;
        });
    }

}