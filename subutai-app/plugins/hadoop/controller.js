'use strict';

angular.module('subutai.plugins.hadoop', [])
    .controller('hadoopCtrl', hadoopCtrl)

hadoopCtrl.$inject = ['hadoopSrv'];

function hadoopCtrl(hadoopSrv)
{
    var vm = this;

    hadoopSrv.gethadoop()(function (data) {
        vm.hadoop= data;
    });
}