'use strict';

angular.module('subutai.plugins.nutch', [])
    .controller('nutchCtrl', nutchCtrl)

nutchCtrl.$inject = ['nutchSrv'];

function nutchCtrl(nutchSrv)
{
    var vm = this;

    nutchSrv.getnutch()(function (data) {
        vm.nutch= data;
    });
}