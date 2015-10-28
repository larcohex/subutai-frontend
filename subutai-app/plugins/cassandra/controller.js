'use strict';

angular.module('subutai.plugins.cassandra.controller', [])
    .controller('cassandraCtrl', cassandraCtrl)

cassandraCtrl.$inject = ['cassandraSrv'];
console.log("outer");
function cassandraCtrl(cassandraSrv)
{
    var vm = this;
    console.log("inner");
    //cassandraSrv.getCassandra()(function (data) {
    //    vm.cassandra= data;
    //});
}