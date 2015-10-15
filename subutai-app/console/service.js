'use strict';

angular.module('subutai.console.service', [])
    .factory('consoleService', consoleService);


consoleService.$inject = ['$http'];

function consoleService($http) {
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
