/**
 * Created by ubuntu on 5/14/15.
 */
'use strict';

angular.module('subutai.tracker.controller', [])
    .controller('TrackerCtrl', TrackerCtrl);

TrackerCtrl.$inject = ['trackerSrv'];
function TrackerCtrl(trackerSrv) {
    var vm = this;

    trackerSrv.getLogs().success(function (data) {
        vm.logs = data;
        if(vm.logs.status === "successful"){
            vm.logStatus.addClass('btn-success');
        }
    });

}
