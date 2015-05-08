'use strict';

angular.module('subutai.identity.service', [])
    .factory('identitySrv', identitySrv);


identitySrv.$inject = ['$http'];

function identitySrv($http) {
    var getUsersURL = 'users.json';

    var identitySrv = {
        getUsers: getUsers,
        addUser : addUser
    };

    return identitySrv;

    //// Implementation

    function getUsers() {
        return $http.get(getUsersURL);
    }

    function addUser() {

    }
}