'use strict';

angular.module('subutai.plugins.mahout', [])
    .controller('mahoutCtrl', mahoutCtrl)

mahoutCtrl.$inject = ['mahoutSrv'];

function mahoutCtrl(mahoutSrv)
{
    var vm = this;

    mahoutSrv.getmahout()(function (data) {
        vm.mahout= data;
    });
}