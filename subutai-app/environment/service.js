'use strict';

angular.module('subutai.environment.service', [])
	.factory('environmentService', environmentService);


environmentService.$inject = ['$http'];

function environmentService($http) {
	var BASE_URL = 'http://172.16.131.205:8181/cxf/';
	var blueprintURL = BASE_URL + 'environments_ui/blueprint/';
	var templatesURL = BASE_URL + 'registry_ui/templates/';
	var peersURL = BASE_URL + 'environments_ui/peers';
	var environmentsURL = BASE_URL + 'environments_ui/';
	var sshKeysURL = environmentsURL + 'key/';

	var getEnvURL = 'subutai-app/environment/dummy-api/environments.json';
	var getContainersURL = 'subutai-app/environment/dummy-api/';
	var getEnvQuotaURL = 'subutai-app/environment/dummy-api/envQuota.json';

	var environmentService = {
		getBlueprints: getBlueprints,
		getTemplates: getTemplates,
		deleteBlueprint : deleteBlueprint,
		getPeers : getPeers,
		buildBlueprint : buildBlueprint,
		getEnvironments : getEnvironments,
		
		removeEnvironments: removeEnvironments,
		destroyEnvironment: destroyEnvironment,
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

	function getPeers() {
		return $http.get(peersURL, {withCredentials: true, headers: {'Content-Type': 'application/json'}});
	}	

	function buildBlueprint(postData) {
		return $http.post(
			environmentsURL, 
			postData, 
			{withCredentials: true, headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
		);
	}

	function getEnvironments() {
		return $http.get(environmentsURL, {withCredentials: true, headers: {'Content-Type': 'application/json'}});
	}

	function destroyEnvironment(environmentId) {
		return $http.delete(environmentsURL + environmentId);		
	}	

	function addSshKey(sshKey, environmentId) {
		var postData = 'environmentId=' + environmentId + '&key=' + sshKey;
		console.log(postData);
		return $http.post(
			sshKeysURL, 
			postData, 
			{withCredentials: true, headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
		);		
	}

	function removeSshKey() {
		return $http.post();
	}	

	function getContainers(envName){
		if (envName == 'Environment1') return $http.get(getContainersURL+'container1.json');
		else if (envName == 'Environment2') return $http.get(getContainersURL+'container2.json');
		else if (envName == 'Environment3') return $http.get(getContainersURL+'container3.json');
	}

	function updateQuota() {
		return $http.get();
	}

	function addBlueprintNode() {
		return $http.get();
	}

	function removeEnvironments() {
		return $http.get();
	}

	function growBlueprint() {
		return $http.get();
	}

	function getEnvQuota() {
		return $http.get(getEnvQuotaURL);
	}

}
