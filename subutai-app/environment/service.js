'use strict';

angular.module('subutai.environment.service', [])
    .factory('environmentService', environmentService);


environmentService.$inject = ['$http'];

function environmentService($http) {
    var getUsersURL = 'subutai-app/environment/dummy-api/blueprints.json';
    var getRolesURL = 'subutai-app/environment/dummy-api/environments.json';

    var environmentService = {
        getBlueprints: getBlueprints,
        getEnvironments : getEnvironments
    };

    return environmentService;

    //// Implementation

    function getBlueprints() {
        return $http.get(getUsersURL);
    }

    function getEnvironments() {
        return $http.get(getRolesURL);
    }
}