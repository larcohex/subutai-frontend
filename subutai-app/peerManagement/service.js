'use strict';

angular.module('subutai.peerManagement.service', [])
    .factory('peerManagementService', peerManagementService);


peerManagementService.$inject = ['$http'];

function peerManagementService($http) {
    var getAllContainersURL = 'subutai-app/peerManagement/dummy-api/containers.json';
    var getContainersURL = 'subutai-app/peerManagement/dummy-api/containers.json';
    var getResourceHostsURL = 'subutai-app/peerManagement/dummy-api/resourceHosts.json';

    var peerManagementService = {
        getAllContainers: getAllContainers,
        getContainers: getContainers,
        getResourceHosts : getResourceHosts
    };

    return peerManagementService;

    //// Implementation

    function getAllContainers() {
        return $http.get(getAllContainersURL);
    }

    function getContainers() {
        return $http.get(getContainersURL);
    }

    function getResourceHosts() {
        return $http.get(getResourceHostsURL );
    }
}