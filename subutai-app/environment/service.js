'use strict';

angular.module('subutai.environment.service', [])
    .factory('environmentService', environmentService);


environmentService.$inject = ['$http'];

function environmentService($http) {
    var getBlueprintURL = 'subutai-app/environment/dummy-api/blueprints.json';
    var getEnvURL = 'subutai-app/environment/dummy-api/environments.json';

    var environmentService = {
        getBlueprints: getBlueprints,
        getEnvironments : getEnvironments,
        removeEnvironments: removeEnvironments,
        destroyEnvironment: destroyEnvironment,
        deleteBlueprint : deleteBlueprint,
        buildBlueprint : buildBlueprint,
        addBlueprintNode: addBlueprintNode,
        createBlueprint : createBlueprint,
        growBlueprint : growBlueprint,
        addSshKey : addSshKey,
        removeSshKey : removeSshKey
    };

    return environmentService;

    //// Implementation

    function getEnvironments() {
        return $http.get(getEnvURL);
    }

    function addBlueprintNode() {
        return $http.get();
    }

    function destroyEnvironment() {
        return $http.post();
    }

    function removeEnvironments() {
        return $http.get();
    }

    function getBlueprints() {
        return $http.get(getBlueprintURL );
    }

    function deleteBlueprint() {
        return $http.delete();
    }

    function buildBlueprint() {
        return $http.post();
    }

    function createBlueprint() {
        return $http.post();
    }

    function growBlueprint() {
        return $http.get();
    }

    function addSshKey() {
        return $http.post();
    }

    function removeSshKey() {
        return $http.post();
    }

}