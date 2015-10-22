'use strict';

angular.module('subutai.core.controller', [])
    .controller('CoreCtrl', CoreCtrl);

CoreCtrl.$inject = ['coreSrv', '$scope'];
function CoreCtrl(coreSrv, $scope) {
    var vm = this;
    vm.myField = {};

    vm.myField.value = "Write Something here";
    vm.check = function() {
        console.log("check worked", vm.myField.value);
    }
}
