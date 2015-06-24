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
    $scope.resourceHosts = [
        {
            "id": "01",
            "name": "Resource Host Hadoop1",
            "color": "{'color':'#6666FF'}"
        },
        {
            "id": "02",
            "name": "Resource Host Cassandra2",
            "color": "{'color':'#FF9966'}"
        },
        {
            "id": "03",
            "name": "Resource Host Spark3",
            "color": "{'color':'#00CC99'}"
        }
    ];
    $scope.containers = [];
    getAllContainers();
    function getAllContainers() {
        peerService.getAllContainers().success(function (data) {
            $scope.containers = data;
        }).error(function () {
            $scope.status = "Could not get all containers";
        });
    }

    function getResourceHosts() {
        peerService.getResourceHosts().success(function (data) {
            for (var i=0; i<data.length; i++)
            {
                document.getElementById("resourceHosts").innerHTML = "<option value='" + data[i].name + "'>" + data[i].name + "</option>";
            }
        }).error(function () {
            $scope.status = "Could not get Resource hosts";
        });
    }

    function getContainer() {
        console.log($scope.rHost);
        peerService.getContainer($scope.rHost[0]).success(function (data) {
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