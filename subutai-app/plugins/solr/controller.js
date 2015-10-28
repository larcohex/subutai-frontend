'use strict';

angular.module('subutai.plugins.solr', [])
    .controller('solrCtrl', solrCtrl)

solrCtrl.$inject = ['solrSrv'];

function solrCtrl(solrSrv)
{
    var vm = this;

    solrSrv.getsolr()(function (data) {
        vm.solr= data;
    });
}