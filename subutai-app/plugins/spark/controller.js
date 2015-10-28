'use strict';

angular.module('subutai.plugins.spark', [])
    .controller('sparkCtrl', sparkCtrl)

sparkCtrl.$inject = ['sparkSrv'];

function sparkCtrl(sparkSrv)
{
    var vm = this;

    sparkSrv.getspark()(function (data) {
        vm.spark= data;
    });
}