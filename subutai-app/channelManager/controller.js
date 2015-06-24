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

    self.addPanel = addPanel;
    self.closePanel = closePanel;

    self.newToken = {
        token: "8f846079-b31f-41da-b3c3-2fdbe81fc49d",
        date: "2015-06-23 15:39:37.823",
        ipRangeStart: "*",
        ipRangeEnd: "*",
        status: true,
        tokenName: "some token",
        username: "Karaf",
        validPeriod: 10
    };

    self.selectedToken = {};

    self.tokens = [
        {
            token: "8f846079-b31f-41da-b3c3-2fdbe81fc49d",
            date: "2015-06-23 15:39:37.823",
            ipRangeStart: "*",
            ipRangeEnd: "*",
            status: true,
            tokenName: "some token",
            username: "Karaf",
            validPeriod: 10
        },
        {
            token: "5c10cc30-cc66-4dc5-b0cf-176955223e72",
            date: "2015-06-23 15:39:15.608",
            ipRangeStart: "*",
            ipRangeEnd: "*",
            status: true,
            tokenName: "some token2",
            username: "Admin",
            validPeriod: 10
        },
        {
            token: "e1d3d925-d6fe-4f42-9a1a-6b02e71c9cda",
            date: "2015-06-23 15:39:16.842",
            ipRangeStart: "*",
            ipRangeEnd: "*",
            status: false,
            tokenName: "some token3",
            username: "User",
            validPeriod: 10
        }
    ];

    function addPanel(action, token) {
        jQuery('#resizable-pane').removeClass('fullWidthPane');
        if (action == 'createBlueprint') {
            jQuery('#build-blueprint-form').css('display', 'none');
            jQuery('#build-blueprint-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#environment-containers-form').css('display', 'none');
            jQuery('#environment-containers-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#environment-sshkey-form').css('display', 'none');
            jQuery('#environment-sshkey-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#create-blueprint-form').css('display', 'block');
            jQuery('#create-blueprint-form').removeClass('bounceOutRight');
            jQuery('#create-blueprint-form').addClass('animated bounceInRight');
        }
        else if (action == 'buildBlueprint') {
            self.selectedToken = token;
            jQuery('#create-blueprint-form').css('display', 'none');
            jQuery('#create-blueprint-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#build-blueprint-form').css('display', 'block');
            jQuery('#build-blueprint-form').removeClass('bounceOutRight');
            jQuery('#build-blueprint-form').addClass('animated bounceInRight');
        }
    }

    function closePanel(action) {
        jQuery('#resizable-pane').addClass('fullWidthPane');
        if (action == 'createBlueprint') {
            jQuery('#create-blueprint-form').addClass('bounceOutRight');
            jQuery('#create-blueprint-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#create-blueprint-form').css('display', 'none');
        }
        else if (action == 'buildBlueprint') {
            jQuery('#build-blueprint-form').addClass('bounceOutRight');
            jQuery('#build-blueprint-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#build-blueprint-form').css('display', 'none');
        }
    }
}
