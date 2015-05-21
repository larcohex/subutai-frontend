'use strict';

angular.module('subutai.peerManagement.service', [])
    .factory('peerManagementService', peerManagementService);


peerManagementService.$inject = ['$http'];

function peerManagementService($http) {
    var getAllContainersURL = 'subutai-app/peerManagement/dummy-api/containers.json';
    var getResourceHostsURL = 'subutai-app/peerManagement/dummy-api/resourceHosts.json';

    var getContainer1URL = 'subutai-app/peerManagement/dummy-api/container1.json';
    var getContainer2URL = 'subutai-app/peerManagement/dummy-api/container2.json';
    var getContainer3URL = 'subutai-app/peerManagement/dummy-api/container3.json';
    var updateContainerURL = 'subutai-app/peerManagement/dummy-api/update.json';
    var destroyContainerURL = 'subutai-app/peerManagement/dummy-api/';

    var peerManagementService = {
        getAllContainers: getAllContainers,
        getContainer: getContainer,
        getResourceHosts : getResourceHosts,
        stopContainer: stopContainer,
        startContainer: startContainer,
        checkContainer: checkContainer,
        destroyContainer: destroyContainer
    };

    return peerManagementService;

    //// Implementation

    function getAllContainers() {
        return $http.get(getAllContainersURL);
    }

    function getContainer(resourceHost) {
        if (resourceHost == "Resource Host Hadoop1") return $http.get(getContainer1URL);
        else if (resourceHost == "Resource Host Cassandra2") return $http.get(getContainer2URL);
        else if (resourceHost == "Resource Host Spark3") return $http.get(getContainer3URL);
    }

    function stopContainer(id) {
        return $http.get(updateContainerURL+id);
    }

    function startContainer(id) {
        return $http.get(updateContainerURL+id);
    }

    function checkContainer(id) {
        return $http.get(updateContainerURL+id);
    }

    function getResourceHosts() {
        return $http.get(getResourceHostsURL );
    }

    function destroyContainer() {
        console.log("destroy");
        return $http.get(destroyContainerURL );
    }
}