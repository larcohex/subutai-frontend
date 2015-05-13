'use strict';

angular.module('subutai.identity.controller', [])
    .controller('IdentityCtrl', IdentityCtrl);

IdentityCtrl.$inject = ['identitySrv'];
function IdentityCtrl(identitySrv) {
    var vm = this;

    vm.addNew = addNew;

    vm.isUser = true;
    vm.isRole = false;
    vm.userFrame = false;

    identitySrv.getUsers().success(function (data) {
        vm.users = data;
    });

    identitySrv.getRoles().success(function (data) {
        vm.roles = data;
    });


    //// Implementation

    function addNew() {
        vm.userFrame = true;
    }
}
