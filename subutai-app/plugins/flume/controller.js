'use strict';

angular.module('subutai.plugins.flume', [])
    .controller('flumeCtrl', flumeCtrl)

flumeCtrl.$inject = ['flumeSrv'];

function flumeCtrl(flumeSrv)
{
    var vm = this;

    flumeSrv.getflume()(function (data) {
        vm.flume= data;
    });
}