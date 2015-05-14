/**
 * Created by ubuntu on 5/14/15.
 */
'use strict';

angular.module('subutai.tracker.controller', [])
    .controller('TrackerCtrl', TrackerCtrl);

TrackerCtrl.$inject = ['trackerSrv'];
function TrackerCtrl(trackerSrv) {
    var vm = this;

    trackerSrv.getSources().success(function (data) {
        vm.sources = data;
    });

}
