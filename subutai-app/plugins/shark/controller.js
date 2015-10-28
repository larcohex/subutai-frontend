'use strict';

angular.module('subutai.plugins.shark', [])
    .controller('sharkCtrl', sharkCtrl)

sharkCtrl.$inject = ['sharkSrv'];

function sharkCtrl(sharkSrv)
{
    var vm = this;

    sharkSrv.getshark()(function (data) {
        vm.shark= data;
    });
}