'use strict';

angular.module('subutai.identity.controller', [])
    .controller('IdentityCtrl', IdentityCtrl);

IdentityCtrl.$inject = ['identitySrv'];
function IdentityCtrl(identitySrv) {
    var vm = this;

    vm.addPane = addPane;
    vm.closePane = closePane;

    vm.isUser = true;
    vm.isRole = false;
    vm.isToken = false;

    identitySrv.getUsers().success(function (data) {
        vm.users = data;
    });

    identitySrv.getRoles().success(function (data) {
        vm.roles = data;
    });
    identitySrv.getTokens().success(function (data) {
        vm.tokens = data;
    });


    //// Implementation

    function addPane() {
        jQuery('#resizable-pane').removeClass('fullWidthPane');
        if( vm.isUser ) {
            jQuery('#role-form').css('display', 'none');
            jQuery('#token-form').css('display', 'none');
            jQuery('#user-form').css('display', 'block');
            jQuery('#role-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#token-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#user-form').removeClass('bounceOutRight');
            jQuery('#user-form').addClass('animated bounceInRight');
        }
        else if( vm.isRole ) {
            jQuery('#user-form').css('display', 'none');
            jQuery('#token-form').css('display', 'none');
            jQuery('#role-form').css('display', 'block');
            jQuery('#user-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#token-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#role-form').removeClass('bounceOutRight');
            jQuery('#role-form').addClass('animated bounceInRight');
        }
        else if( vm.isToken ) {
            jQuery('#user-form').css('display', 'none');
            jQuery('#role-form').css('display', 'none');
            jQuery('#token-form').css('display', 'block');
            jQuery('#user-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#role-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#token-form').removeClass('bounceOutRight');
            jQuery('#token-form').addClass('animated bounceInRight');
        }
    }

    function closePane() {
        jQuery('#resizable-pane').addClass('fullWidthPane');
        if( vm.isUser ) {
            jQuery('#user-form').addClass('bounceOutRight');
            jQuery('#user-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#user-form').css('display', 'none');
        }
        else if( vm.isRole ) {
            jQuery('#role-form').addClass('bounceOutRight');
            jQuery('#role-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#role-form').css('display', 'none');
        }
        else if( vm.isToken ) {
            jQuery('#token-form').addClass('bounceOutRight');
            jQuery('#token-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#token-form').css('display', 'none');
        }
    }
}
