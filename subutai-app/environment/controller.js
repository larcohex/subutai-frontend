'use strict';

angular.module('subutai.environment.controller', [])
    .controller('EnvironmentViewCtrl', EnvironmentViewCtrl);

EnvironmentViewCtrl.$inject = ['$scope', 'environmentService'];

function EnvironmentViewCtrl($scope, environmentService) {
    $scope.getBlueprints = getBlueprints;
    $scope.getEnvironments = getEnvironments;
    $scope.removeEnvironments = removeEnvironments;
    $scope.destroyEnvironment = destroyEnvironment;
    $scope.deleteBlueprint = deleteBlueprint;
    $scope.buildBlueprint = buildBlueprint;
    $scope.createBlueprint = createBlueprint;
    $scope.addBlueprintNode = addBlueprintNode;
    $scope.growBlueprint = growBlueprint;
    $scope.addSshKey = addSshKey;
    $scope.removeSshKey = removeSshKey;


    $scope.addPanel = addPanel;
    $scope.closePanel = closePanel;

    $scope.blueprints = [];
    $scope.environments = [];

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

    function destroyEnvironment() {
        environmentService.destroyEnvironment().success(function (data) {

        }).error(function () {

        });
    }

    function addBlueprintNode() {
        environmentService.addBlueprintNode().success(function (data) {

        }).error(function () {

        });
    }

    function removeEnvironments(){
        environmentService.removeEnvironments().success(function () {

        }).error(function () {

        })
    }

    function deleteBlueprint(){
        environmentService.deleteBlueprint().success(function () {

        }).error(function () {

        })
    }

    function buildBlueprint(){
        environmentService.buildBlueprint().success(function () {

        }).error(function () {

        })
    }

    function createBlueprint(){
        environmentService.createBlueprint().success(function () {

        }).error(function () {

        })
    }

    function growBlueprint(){
        environmentService.growBlueprint().success(function () {

        }).error(function () {

        })
    }

    function addSshKey(){
        environmentService.addSshKey().success(function () {

        }).error(function () {

        })
    }

    function removeSshKey(){
        environmentService.removeSshKey().success(function () {

        }).error(function () {

        })
    }
    //// Implementation

    function addPanel(action) {
        jQuery('#resizable-pane').removeClass('fullWidthPane');
        if( action == 'createBlueprint' ) {
            jQuery('#build-blueprint-form').css('display', 'none');
            jQuery('#environment-containers-form').css('display', 'none');
            jQuery('#environment-sshkey-form').css('display', 'none');
            jQuery('#create-blueprint-form').css('display', 'block');
            jQuery('#environment-containers-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#environment-sshkey-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#build-blueprint-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#create-blueprint-form').removeClass('bounceOutRight');
            jQuery('#create-blueprint-form').addClass('animated bounceInRight');
        }
        else if( action == 'buildBlueprint' ) {
            jQuery('#environment-containers-form').css('display', 'none');
            jQuery('#environment-sshkey-form').css('display', 'none');
            jQuery('#create-blueprint-form').css('display', 'none');
            jQuery('#build-blueprint-form').css('display', 'block');
            jQuery('#create-blueprint-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#environment-sshkey-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#environment-containers-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#build-blueprint-form').removeClass('bounceOutRight');
            jQuery('#build-blueprint-form').addClass('animated bounceInRight');
        }
        else if( action == 'envContainers' ) {
            jQuery('#create-blueprint-form').css('display', 'none');
            jQuery('#build-blueprint-form').css('display', 'none');
            jQuery('#environment-sshkey-form').css('display', 'none');
            jQuery('#environment-containers-form').css('display', 'block');
            jQuery('#create-blueprint-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#environment-sshkey-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#build-blueprint-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#environment-containers-form').removeClass('bounceOutRight');
            jQuery('#environment-containers-form').addClass('animated bounceInRight');
        }
        else if( action == 'envSshKey' ) {
            jQuery('#create-blueprint-form').css('display', 'none');
            jQuery('#build-blueprint-form').css('display', 'none');
            jQuery('#environment-containers-form').css('display', 'none');
            jQuery('#environment-sshkey-form').css('display', 'block');
            jQuery('#create-blueprint-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#build-blueprint-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#environment-containers-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#environment-sshkey-form').removeClass('bounceOutRight');
            jQuery('#environment-sshkey-form').addClass('animated bounceInRight');
        }
    }

    function closePanel(action) {
        jQuery('#resizable-pane').addClass('fullWidthPane');
        if( action == 'createBlueprint' ) {
            jQuery('#create-blueprint-form').addClass('bounceOutRight');
            jQuery('#create-blueprint-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#create-blueprint-form').css('display', 'none');
        }
        else if( action == 'buildBlueprint' ) {
            jQuery('#build-blueprint-form').addClass('bounceOutRight');
            jQuery('#build-blueprint-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#build-blueprint-form').css('display', 'none');
        }
        else if( action == 'envContainers' ) {
            jQuery('#environment-containers-form').addClass('bounceOutRight');
            jQuery('#environment-containers-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#environment-containers-form').css('display', 'none');
        }
        else if( action == 'envSshKey' ) {
            jQuery('#environment-sshkey-form').addClass('bounceOutRight');
            jQuery('#environment-sshkey-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#environment-sshkey-form').css('display', 'none');
        }
    }

}