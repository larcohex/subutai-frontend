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
		installHubPlugin: installHubPlugin,
		getInstalledHubPlugins: getInstalledHubPlugins,
		uninstallHubPlugin: uninstallHubPlugin
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


	function installHubPlugin (plugin) {
		var kar = "";
		if (plugin.metadata[0].substring (plugin.metadata[0].length - 4, plugin.metadata[0].length) === ".kar") {
			kar = plugin.metadata[0];
		}
		else {
			kar = plugin.metadata[1];
		}
		var postData = "name=" + plugin.name + "&version=" + plugin.version + "&kar=" + kar + "&url=" + plugin.name.toLowerCase();
		console.log (postData);
		return $http.post(
			SERVER_URL + "rest/bazaar/install",
			postData,
			{withCredentials: true, headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
		);
	}


	function uninstallHubPlugin (plugin) {
		var kar = "";
		if (plugin.metadata[0].substring (plugin.metadata[0].length - 4, plugin.metadata[0].length) === ".kar") {
			kar = plugin.metadata[0];
		}
		else {
			kar = plugin.metadata[1];
		}
		var postData = "id=" + plugin.hubId + "&kar=" + kar;
		console.log (postData);
		return $http.post(
			SERVER_URL + "rest/bazaar/uninstall",
			postData,
			{withCredentials: true, headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
		);
	}

	function getInstalledHubPlugins() {
		return $http.get (SERVER_URL + "rest/bazaar/installed", {withCredentials: true, headers: {'Content-Type': 'application/json'}});
	}
}