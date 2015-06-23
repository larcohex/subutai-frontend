/**
 * Created by talas on 6/23/15.
 */
'use strict';

angular
    .module('subutai.channel-manager.controller', [])
    .controller('ChannelManagerCtrl', ChannelManagerCtrl);

ChannelManagerCtrl.$inject = ['channelManagerService'];

function ChannelManagerCtrl(channelManagerService) {
    var self = this;

    self.oldText = null;
    self.newText = null;

    self.templates = [];
    self.diffFiles = [];
    self.filesTree = [{}];
}
