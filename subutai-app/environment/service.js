'use strict';

angular.module('subutai.environment.service', [])
	.factory('environmentService', environmentService);


environmentService.$inject = ['$http'];

function environmentService($http) {
	var BASE_URL = serverUrl + 'environments_ui/';

	var ENVIRONMENTS_URL = BASE_URL;
	var SSH_KEY_URL = ENVIRONMENTS_URL + 'key/';
	var CONTAINERS_URL = ENVIRONMENTS_URL + 'containers/';
	var CONTAINER_TYPES_URL = CONTAINERS_URL + 'types/';

	var BLUEPRINT_URL = BASE_URL + 'blueprints/';

	var GROW_BLUEPRINT_URL = BASE_URL + 'grow/';

	var STRATEGIES_URL = BASE_URL + 'strategies/';

	var TEMPLATES_URL = BASE_URL + 'templates/';

	var PEERS_URL = BASE_URL + 'peers/';


	var environmentService = {
		getTemplates: getTemplates,


		getBlueprints: getBlueprints,
		getBlueprintById: getBlueprintById,
		saveBlueprint : saveBlueprint,
		deleteBlueprint : deleteBlueprint,


		getEnvironments : getEnvironments,
		createEnvironment : createEnvironment,
		growEnvironment : growEnvironment,
		destroyEnvironment: destroyEnvironment,


		setSshKey : setSshKey,
		removeSshKey : removeSshKey,


		setDomain : setDomain,
		removeDomain : removeDomain,


		getContainerStatus : getContainerStatus,
		destroyContainer : destroyContainer,
		switchContainer : switchContainer,


		getContainersType : getContainersType,


		getEnvQuota: getEnvQuota,
		updateQuota: updateQuota,


		getStrategies : getStrategies,


		getPeers : getPeers
	};

	return environmentService;




	//// Implementation

	function getTemplates() {
		return $http.get(TEMPLATES_URL, {withCredentials: true, headers: {'Content-Type': 'application/json'}});
	}

	function getBlueprints() {
		return $http.get(BLUEPRINT_URL, {withCredentials: true, headers: {'Content-Type': 'application/json'}});
	}

	function getBlueprintById(blueprintId) {
		return $http.get(BLUEPRINT_URL + blueprintId, {withCredentials: true, headers: {'Content-Type': 'application/json'}});
	}

	function saveBlueprint(blueprint_json) {
		var data = 'blueprint_json=' + blueprint_json;
		return $http.post(
			BLUEPRINT_URL,
			data,
			{withCredentials: true, headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
		);
	}

	function deleteBlueprint(blueprintId) {
		return $http.delete(BLUEPRINT_URL + blueprintId);
	}



	function getEnvironments() {
		return $http.get(ENVIRONMENTS_URL, {withCredentials: true, headers: {'Content-Type': 'application/json'}});
	}

	function createEnvironment(data) {
		var postData = 'blueprint_json=' + data;
		return $http.post(
			ENVIRONMENTS_URL,
			postData, 
			{withCredentials: true, headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
		);
	}

	function growEnvironment(environmentId, data) {
		var postData = 'environmentId=' + environmentId + '&blueprint_json=' + data;
		return $http.post(
			GROW_BLUEPRINT_URL,
			postData, 
			{withCredentials: true, headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
		);
	}

	function destroyEnvironment(environmentId) {
		return $http.delete(ENVIRONMENTS_URL + environmentId);
	}



	function switchContainer(containerId, type) {
		return $http.post(
			CONTAINERS_URL + containerId + '/' + type,
			{withCredentials: true, headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
		);
	}

	function getContainerStatus(containerId) {
		return $http.get(
			CONTAINERS_URL + containerId + '/state',
			{withCredentials: true, headers: {'Content-Type': 'application/json'}}
		);
	}

	function destroyContainer(containerId) {
		return $http.delete(CONTAINERS_URL + containerId);
	}



	function setSshKey(sshKey, environmentId) {
		var postData = 'environmentId=' + environmentId + '&key=' + sshKey;
		console.log(postData);
		return $http.post(
			SSH_KEY_URL,
			postData, 
			{withCredentials: true, headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
		);
	}

	function removeSshKey(environmentId) {
		return $http.delete(ENVIRONMENTS_URL + environmentId + '/keys');
	}


	function setDomain(envId, domainName, file) {
		var fd = new FormData();
		fd.append('environmentId', envId);
		fd.append('hostName', domainName);
		fd.append('file', file);

		return $http.post(
			ENVIRONMENTS_URL + 'domains',
			fd,
			{transformRequest: angular.identity, headers: {'Content-Type': undefined}}
		);
	}

	function removeDomain( envId ) {
		return $http.delete( ENVIRONMENTS_URL + envId + '/domains' );
	}


	function getContainersType() {
		return $http.get(CONTAINER_TYPES_URL, {withCredentials: true, headers: {'Content-Type': 'application/json'}});
	}

	function getEnvQuota(containerId) {
		return $http.get(
			CONTAINERS_URL + containerId + '/quota',
			{withCredentials: true, headers: {'Content-Type': 'application/json'}}
		);
	}	

	function updateQuota(containerId, postData) {
		return $http.post(
			CONTAINERS_URL + containerId + '/quota',
			postData, 
			{withCredentials: true, headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
		);
	}


	function getStrategies() {
		return $http.get(STRATEGIES_URL, {withCredentials: true, headers: {'Content-Type': 'application/json'}});
	}


	function getPeers() {
		return $http.get(PEERS_URL, {withCredentials: true, headers: {'Content-Type': 'application/json'}});
	}
}
