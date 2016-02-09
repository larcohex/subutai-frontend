'use strict';

angular.module('subutai.bazaar.service',[])
	.factory('BazaarSrv', BazaarSrv);

BazaarSrv.$inject = ['$http'];

function BazaarSrv($http) {

	var BASE_URL = SERVER_URL + "rest/v1/plugininjector/";

	var BazaarSrv = {
		uploadPlugin: uploadPlugin,
		getInstalledPlugins: getInstalledPlugins,
		deletePlugin: deletePlugin,
		editPermissions: editPermissions,
		getPermissions: getPermissions,
		getHubPlugins: getHubPlugins,
		installHubPlugin: installHubPlugin
	};

	return BazaarSrv;

	function uploadPlugin (pluginName, pluginVersion, kar, permissions) {
		var fd = new FormData();
		fd.append('name', pluginName);
		fd.append('version', pluginVersion);
		fd.append('kar', kar);
		fd.append('permission', permissions);
		return $http.post(
			BASE_URL + 'upload',
			fd,
			{transformRequest: angular.identity, headers: {'Content-Type': undefined}}
		);
	}

	function deletePlugin (plugin) {
		return $http.delete (BASE_URL + "plugins/" + plugin);
	}

	function getInstalledPlugins() {
		return $http.get (BASE_URL + "plugins/registered");
	}

	function editPermissions (postData) {
		return $http.post(
			BASE_URL + "plugins/permission",
			postData,
			{withCredentials: true, headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
		);
	}

	function getPermissions (pluginId) {
		return $http.get (BASE_URL + "plugins/registered/" + pluginId);
	}



	function getHubPlugins() {
		return $http.get (SERVER_URL + "rest/bazaar/products", {withCredentials: true, headers: {'Content-Type': 'application/json'}});
	}

	function installHubPlugin (id) {
		var postData = "id=" + id;
		return $http.post(
			BASE_URL + "rest/bazaar/install",
			postData,
			{withCredentials: true, headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
		);
	}
}
