'use strict';

angular.module('subutai.identity.controller', [])
    .controller('IdentityCtrl', IdentityCtrl);

IdentityCtrl.$inject = ['$scope', 'identitySrv'];
function IdentityCtrl($scope, identitySrv) {

    identitySrv.getUsers().success(function (data) {
        $scope.users = data;
    });

    identitySrv.getRoles().success(function (data) {
        $scope.roles = data;
    });


}
