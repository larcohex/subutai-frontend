'use strict';

angular.module('subutai.environment.controller', [])
    .controller('EnvironmentViewCtrl', EnvironmentViewCtrl);

EnvironmentViewCtrl.$inject = ['$scope', 'environmentService'];

function EnvironmentViewCtrl($scope, environmentService) {
    $scope.getBlueprints = getBlueprints;
    $scope.getEnvironments = getEnvironments;
    $scope.addPane = addPane;
    $scope.closePane = closePane;

    $scope.blueprints = [];
    $scope.environments = [];
    $scope.isUser = true;
    $scope.isRole = false;
    $scope.isToken = false;

    getBlueprints();
    getEnvironments();

    function getBlueprints() {
        environmentService.getBlueprints().success(function (data) {
            $scope.blueprints = data;
        }).error(function () {
            $scope.status = "Could not get Blueprints";
        });
    }

    function getEnvironments() {
        environmentService.getEnvironments().success(function (data) {
            $scope.environments = data;
        }).error(function () {
            $scope.status = "Could not get Environments";
        });
    }

    //// Implementation

    function addPane() {
        console.log("ADD PANE");
        jQuery('#resizable-pane').removeClass('fullWidthPane');
        if( $scope.isUser ) {
            jQuery('#role-form').css('display', 'none');
            jQuery('#token-form').css('display', 'none');
            jQuery('#user-form').css('display', 'block');
            jQuery('#role-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#token-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#user-form').removeClass('bounceOutRight');
            jQuery('#user-form').addClass('animated bounceInRight');
        }
        else if( $scope.isRole ) {
            jQuery('#user-form').css('display', 'none');
            jQuery('#token-form').css('display', 'none');
            jQuery('#role-form').css('display', 'block');
            jQuery('#user-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#token-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#role-form').removeClass('bounceOutRight');
            jQuery('#role-form').addClass('animated bounceInRight');
        }
        else if( $scope.isToken ) {
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
        if( $scope.isUser ) {
            jQuery('#user-form').addClass('bounceOutRight');
            jQuery('#user-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#user-form').css('display', 'none');
        }
        else if( $scope.isRole ) {
            jQuery('#role-form').addClass('bounceOutRight');
            jQuery('#role-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#role-form').css('display', 'none');
        }
        else if( $scope.isToken ) {
            jQuery('#token-form').addClass('bounceOutRight');
            jQuery('#token-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#token-form').css('display', 'none');
        }
    }

}