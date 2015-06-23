/**
 * Created by talas on 6/23/15.
 */
'use strict';

angular.module('subutai.channel-manager.service', [])
    .factory('channelManagerService', channelManagerService);


channelManagerService.$inject = ['$http'];

function channelManagerService($http) {
    var getTemplatesURL = 'subutai-app/registry/dummy-api/templates.json';

    var getFileContentForTemplatesURL = ['subutai-app/registry/dummy-api/fileContent.json', 'subutai-app/registry/dummy-api/fileContent1.json'];
    var inx = 1;

    var getTemplatesDiffFilesURL = 'subutai-app/registry/dummy-api/templatesDiffFiles.json';

    return {
        getTemplates: getTemplates,
        getFileContents: getFileContents,
        getTemplatesDiffFiles: getTemplatesDiffFiles
    };

    function getTemplates() {
        return $http.get(getTemplatesURL);
    }

    function getFileContents(templateA, templateB, filePath) {
        return $http.get(getFileContentForTemplatesURL[inx++ % getFileContentForTemplatesURL.length]);
    }

    function getTemplatesDiffFiles(templateA, templateB) {
        return $http.get(getTemplatesDiffFilesURL);
    }
}