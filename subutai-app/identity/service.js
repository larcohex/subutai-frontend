'use strict';

angular.module('subutai.identity.service', [])
    .factory('identitySrv', identitySrv);


identitySrv.$inject = ['$http'];

function identitySrv($http) {
    var getUsersURL = 'subutai-app/identity/dummy-api/users.json';
    var getRolesURL = 'subutai-app/identity/dummy-api/roles.json';

    var identitySrv = {
        getUsers: getUsers,
        addUser : addUser,
        getRoles: getRoles
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
}