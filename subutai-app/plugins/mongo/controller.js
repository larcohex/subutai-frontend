'use strict';

angular.module('subutai.plugins.mongo', [])
    .controller('mongoCtrl', mongoCtrl)

mongoCtrl.$inject = ['mongoSrv'];

function mongoCtrl(mongoSrv)
{
    var vm = this;

    mongoSrv.getmongo()(function (data) {
        vm.mongo= data;
    });
}