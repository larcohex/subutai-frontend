'use strict';

angular.module('subutai.environment.service', [])
	.factory('environmentService', environmentService);


environmentService.$inject = ['$http'];

function environmentService($http) {
	var blueprintURL = 'http://172.16.131.205:8181/cxf/environments_ui/blueprint/';
	var templatesURL = 'http://172.16.131.205:8181/cxf/registry_ui/templates/';
	var getEnvURL = 'subutai-app/environment/dummy-api/environments.json';
	var getContainersURL = 'subutai-app/environment/dummy-api/';
	var getEnvQuotaURL = 'subutai-app/environment/dummy-api/envQuota.json';

	var environmentService = {
		getBlueprints: getBlueprints,
		getTemplates: getTemplates,
		deleteBlueprint : deleteBlueprint,
		
		getEnvironments : getEnvironments,
		removeEnvironments: removeEnvironments,
		destroyEnvironment: destroyEnvironment,
		buildBlueprint : buildBlueprint,
		addBlueprintNode: addBlueprintNode,
		createBlueprint : createBlueprint,
		growBlueprint : growBlueprint,
		addSshKey : addSshKey,
		removeSshKey : removeSshKey,
		getContainers: getContainers,
		getEnvQuota: getEnvQuota,
		updateQuota: updateQuota
	};

	return environmentService;

	//// Implementation

	function getBlueprints() {
		return $http.get(blueprintURL, {withCredentials: true, headers: {'Content-Type': 'application/json'}});
	}

	function getTemplates() {
		return $http.get(templatesURL, {withCredentials: true, headers: {'Content-Type': 'application/json'}});
	}

	function createBlueprint(blueprint_json) {
		var data = 'blueprint_json=' + blueprint_json;
		return $http.post(
			blueprintURL, 
			data, 
			{withCredentials: true, headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
		);
	}

	function deleteBlueprint(blueprintId) {
		return $http.delete(blueprintURL + blueprintId);
	}

	function getContainers(envName){
		if (envName == 'Environment1') return $http.get(getContainersURL+'container1.json');
		else if (envName == 'Environment2') return $http.get(getContainersURL+'container2.json');
		else if (envName == 'Environment3') return $http.get(getContainersURL+'container3.json');
	}

	function updateQuota() {
		return $http.get();
	}

	function getEnvironments() {
		return $http.get(getEnvURL);
	}

	function addBlueprintNode() {
		return $http.get();
	}

	function destroyEnvironment() {
		return $http.post();
	}

	function removeEnvironments() {
		return $http.get();
	}

	function buildBlueprint() {
		return $http.post();
	}

	function growBlueprint() {
		return $http.get();
	}

	function addSshKey() {
		return $http.post();
	}

	function removeSshKey() {
		return $http.post();
	}

	function getEnvQuota() {
		return $http.get(getEnvQuotaURL);
	}

}
