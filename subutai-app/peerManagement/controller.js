'use strict';

angular.module('subutai.peerManagement.controller', [])
    .controller('PeerManagementViewCtrl', PeerManagementViewCtrl);

PeerManagementViewCtrl.$inject = ['$scope', 'peerManagementService'];

function PeerManagementViewCtrl($scope, peerManagementService) {
    $scope.getResourceHosts = getResourceHosts;
    $scope.getAllContainers = getAllContainers;
    $scope.getContainers = getContainers;

    $scope.resourceHosts = [];
    $scope.containers = [];

    $scope.test = ". TEST_TEST_TEST .";

    getAllContainers();
    getResourceHosts();

    function getAllContainers() {
        peerManagementService.getAllContainers().success(function (data) {
            $scope.containers = data;
            console.log(data);
        }).error(function () {
            $scope.status = "Could not get all containers";
        });
    }

    function getResourceHosts() {
        peerManagementService.getResourceHosts().success(function (data) {
            $scope.resourceHosts = data;
        }).error(function () {
            $scope.status = "Could not get Resource hosts";
        });
    }

    function getContainers() {
        console.log("GET CONTAINERS");
        peerManagementService.getContainers().success(function (data) {
            $scope.containers = data;
        }).error(function () {
            $scope.status = "Could not get Containers";
        });
    }

}