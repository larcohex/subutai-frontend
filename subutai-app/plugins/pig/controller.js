'use strict';

angular.module('subutai.plugins.pig', [])
    .controller('pigCtrl', pigCtrl)

pigCtrl.$inject = ['pigSrv'];

function pigCtrl(pigSrv)
{
    var vm = this;

    pigSrv.getpig()(function (data) {
        vm.pig= data;
    });
}