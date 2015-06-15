/**
 * Created by talas on 5/15/15.
 */
'use strict';

angular.module('subutai.registry.service', [])
    .factory('registryService', registryService);


registryService.$inject = ['$http'];

function registryService($http) {
    var getTemplatesURL = 'subutai-app/registry/dummy-api/templates.json';

    var registryService = {
        getTemplates: getTemplates
    };

    return registryService;

    function getTemplates() {
        return $http.get(getTemplatesURL);
    }
}