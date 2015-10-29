'use strict';

angular.module('subutai.plugins.zookeeper', [])
    .controller('zookeeperCtrl', zookeeperCtrl)

zookeeperCtrl.$inject = ['zookeeperSrv'];

function zookeeperCtrl(zookeeperSrv)
{
    var vm = this;

    zookeeperSrv.getzookeeper()(function (data) {
        vm.zookeeper= data;
    });
}