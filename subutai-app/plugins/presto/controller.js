'use strict';

angular.module('subutai.plugins.presto', [])
    .controller('prestoCtrl', prestoCtrl)

prestoCtrl.$inject = ['prestoSrv'];

function prestoCtrl(prestoSrv)
{
    var vm = this;

    prestoSrv.getpresto()(function (data) {
        vm.presto= data;
    });
}