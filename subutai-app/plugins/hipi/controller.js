'use strict';

angular.module('subutai.plugins.hipi', [])
    .controller('hipiCtrl', hipiCtrl)

hipiCtrl.$inject = ['hipiSrv'];

function hipiCtrl(hipiSrv)
{
    var vm = this;

    hipiSrv.gethipi()(function (data) {
        vm.hipi= data;
    });
}