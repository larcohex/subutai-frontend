/**
 * Created by talas on 5/15/15.
 */
'use strict';

angular
    .module('subutai.registry.controller', [])
    .controller('RegistryCtrl', RegistryCtrl)
    .controller('nestableCtrl', nestableCtrl);

RegistryCtrl.$inject = ['registryService'];
function RegistryCtrl(registryService) {
    var self = this;

    self.oldText = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only centuries, but also the leap into electronic typesetting.';
    self.newText = 'Lorem Ipsum is simply typesetting dummy text of the printing and has been the industry\'s typesetting. Lorem Ipsum has been the industry\'s standard dummy text ever the 1500s, when an printer took a galley of type and simply it to make a type. It has survived not only five centuries, but survived not also the leap into electronic typesetting.';

    self.oldText1 = 'Lorem Ipsum is simply printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text eve';
    self.newText1 = 'Ting dummy text of the printing and has been the industry\'s typesetting. Lorem Ipsum has been the industry\'s';

    self.templates = [];

    getTemplates();

    function getTemplates() {
        registryService.getTemplates().success(function (data) {
            self.templates = data;
        }).error(function () {
            self.status = "Couldn't get templates";
        });
    }
}

function nestableCtrl($scope) {
    $scope.remove = function(scope) {
        scope.remove();
    };
    $scope.toggle = function(scope) {
        scope.toggle();
    };
    $scope.moveLastToTheBeginning = function () {
        var a = $scope.data.pop();
        $scope.data.splice(0,0, a);
    };
    $scope.newSubItem = function(scope) {
        var nodeData = scope.$modelValue;
        nodeData.nodes.push({
            id: nodeData.id * 10 + nodeData.nodes.length,
            title: nodeData.title + '.' + (nodeData.nodes.length + 1),
            nodes: []
        });
    };
    $scope.collapseAll = function() {
        $scope.$broadcast('collapseAll');
    };
    $scope.expandAll = function() {
        $scope.$broadcast('expandAll');
    };
    $scope.data = [{
        "id": 1,
        "title": "node1",
        "nodes": [
            {
                "id": 11,
                "title": "node1.1",
                "nodes": [
                    {
                        "id": 111,
                        "title": "node1.1.1",
                        "nodes": []
                    }
                ]
            },
            {
                "id": 12,
                "title": "node1.2",
                "nodes": []
            }
        ]
    }, {
        "id": 2,
        "title": "node2",
        "nodes": [
            {
                "id": 21,
                "title": "node2.1",
                "nodes": []
            },
            {
                "id": 22,
                "title": "node2.2",
                "nodes": []
            }
        ]
    }, {
        "id": 3,
        "title": "node3",
        "nodes": [
            {
                "id": 31,
                "title": "node3.1",
                "nodes": []
            }
        ]
    }];
}
