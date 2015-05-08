'use strict';

angular.module('subutai.identity.controller', [])
    .controller('IdentityTableCtrl', IdentityTableCtrl);

IdentityTableCtrl.$inject = ['$scope', 'identitySrv'];
function IdentityTableCtrl($scope, identitySrv) {

    identitySrv.getUsers().success(function (data) {
        $scope.users = data;
        console.log(data);
    });

    identitySrv.getRoles().success(function (data) {
        $scope.roles = data;
    });
}