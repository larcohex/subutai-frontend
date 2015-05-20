/**
 * Created by ubuntu on 5/14/15.
 */
'use strict';

angular.module('subutai.tracker.controller', [])
    .controller('TrackerCtrl', TrackerCtrl);

TrackerCtrl.$inject = ['trackerSrv'];
//var elem = jQuery('logStatus');
function TrackerCtrl(trackerSrv) {
    var vm = this;

    trackerSrv.getLogs().success(function (data) {
        vm.logs = data;
        //switch (vm.logs.status){
        //    case 'successful':
        //        elem.addClass('btn-success');
        //}
    });
    trackerSrv.getSpecificLogs().success(function (data) {
            vm.specificLogs = data;

    });
}
