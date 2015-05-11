'use strict';

angular.module('subutai.environment.controller', [])
    .controller('EnvironmentViewCtrl', EnvironmentViewCtrl);

EnvironmentViewCtrl.$inject = ['$scope', 'environmentService'];

function EnvironmentViewCtrl($scope, environmentService) {
    $scope.getBlueprints = getBlueprints;
    $scope.getEnvironments = getEnvironments;

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

}