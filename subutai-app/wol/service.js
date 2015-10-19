'use strict';

angular.module('subutai.wol.service', [])
    .factory('wolService', wolService);


wolService.$inject = ['$http'];

function wolService($http) {
    //var getAllContainersURL = 'subutai-app/console/dummy-api/console.json';

    var consoleService = {
        getTestComand: getTestComand,
    };

    return consoleService;

    // Implementation

    function getTestComand() {
		console.log('done');
        return 'done';
    }
}
