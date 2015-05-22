'use strict';

angular.module('subutai.peer.controller', [])
    .controller('peerViewCtrl', peerViewCtrl);

peerViewCtrl.$inject = ['$scope', 'peerService'];

function peerViewCtrl($scope, peerService) {
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
        peerService.getAllContainers().success(function (data) {
            $scope.containers = data;
        }).error(function () {
            $scope.status = "Could not get all containers";
        });
    }

    function getResourceHosts() {
        peerService.getResourceHosts().success(function (data) {
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
        peerService.getContainer(this.rHost).success(function (data) {
            $scope.containers = data;
        });
    }

    function stopContainer(id) {
        peerService.stopContainer(id).success(function (data) {
            $scope.containers = data;
        });
    }

    function startContainer(id) {
        peerService.startContainer(id).success(function (data) {
            $scope.containers = data;
        });
    }

    function checkContainer(id) {
        peerService.checkContainer(id).success(function (data) {
            $scope.containers = data;
        });
    }

    function destroyContainer(id) {
        peerService.destroyContainer(id).success(function (data) {
            $scope.containers = data;
        });
    }

}