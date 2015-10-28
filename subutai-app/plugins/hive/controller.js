'use strict';

angular.module('subutai.plugins.hive', [])
    .controller('hiveCtrl', hiveCtrl)

hiveCtrl.$inject = ['hiveSrv'];

function hiveCtrl(hiveSrv)
{
    var vm = this;

    hiveSrv.gethive()(function (data) {
        vm.hive= data;
    });
}