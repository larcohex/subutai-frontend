'use strict';

angular.module('subutai.identity.service', [])
    .factory('identitySrv', identitySrv);


identitySrv.$inject = ['$http'];

function identitySrv($http) {
    var getUsersURL = 'subutai-app/identity/dummy-api/users.json';
    var getRolesURL = 'subutai-app/identity/dummy-api/roles.json';
    var getTokensURL = 'subutai-app/identity/dummy-api/tokens.json';

    var identitySrv = {
        getUsers: getUsers,
        addUser : addUser,
        getRoles: getRoles,
        getTokens: getTokens
    };

    return identitySrv;

    //// Implementation

    function getUsers() {
        return $http.get(getUsersURL);
    }

    function addUser() {

    }

    function getRoles() {
        return $http.get(getRolesURL);
    }


    function getTokens() {
        return $http.get(getTokensURL);
    }
}