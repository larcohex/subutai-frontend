'use strict';

angular.module('subutai.plugins.oozie', [])
    .controller('oozieCtrl', oozieCtrl)

oozieCtrl.$inject = ['oozieSrv'];

function oozieCtrl(oozieSrv)
{
    var vm = this;

    oozieSrv.getoozie()(function (data) {
        vm.oozie= data;
    });
}