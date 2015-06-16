/**
 * Created by talas on 5/15/15.
 */
'use strict';

angular
    .module('subutai.registry.controller', [])
    .controller('RegistryCtrl', RegistryCtrl);

RegistryCtrl.$inject = ['registryService'];
function RegistryCtrl(registryService) {
    var self = this;

    self.oldText = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only centuries, but also the leap into electronic typesetting.';
    self.newText = 'Lorem Ipsum is simply typesetting dummy text of the printing and has been the industry\'s typesetting. Lorem Ipsum has been the industry\'s standard dummy text ever the 1500s, when an printer took a galley of type and simply it to make a type. It has survived not only five centuries, but survived not also the leap into electronic typesetting.';

    self.oldText1 = 'Lorem Ipsum is simply printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text eve';
    self.newText1 = 'Ting dummy text of the printing and has been the industry\'s typesetting. Lorem Ipsum has been the industry\'s';

    self.templates = [];
    self.templateNames = [];
    self.templatesInfo = {};

    getTemplates();

    function getTemplates() {
        registryService.getTemplates().success(function (data) {
            self.templates = data;
        }).error(function () {
            self.status = "Couldn't get templates";
        });
    }

    //Side tree items
    self.templateSelected = function (value) {
        self.selectedItem = value;
    };

    self.toggle = function (scope) {
        scope.toggle();
    };

    self.collapseAll = function () {
        self.$broadcast('collapseAll');
    };
    self.expandAll = function () {
        self.$broadcast('expandAll');
    };

    self.fileSelected = function (pathToFile){

    }
}
