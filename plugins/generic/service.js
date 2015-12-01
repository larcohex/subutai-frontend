'use strict';

angular.module('subutai.plugins.generic.service',[])
	.factory('genericSrv', genericSrv);

genericSrv.$inject = ['$http', 'environmentService'];


function genericSrv($http, environmentService) {
	var BASE_URL = SERVER_URL + 'rest/generic/';

	var genericSrv = {
		listProfiles: listProfiles,
		saveProfile: saveProfile,
		deleteProfile: deleteProfile,

		listOperations: listOperations,
		saveOperation: saveOperation,
		updateOperation: updateOperation,
		deleteOperation: deleteOperation,

		getEnvironments: getEnvironments,
		executeOperation: executeOperation
	};

	return genericSrv;

	// Create

	function listProfiles() {
		return $http.get (BASE_URL + "profiles");
	}

	function saveProfile (profile) {
		var postData = "profileName=" + profile;
		return $http.post (BASE_URL + "profiles/create", postData, {withCredentials: true, headers: {'Content-Type': 'application/x-www-form-urlencoded'}});
	}


	function deleteProfile (profile) {
		var deleteData = "profileName=" + profile;
		return $http.delete (BASE_URL + "profiles/" + profile);
	}


	// Manage

	function listOperations (profile) {
		return $http.get (BASE_URL + "operations/" + profile);
	}


	function saveOperation (profile, operation, file) {
		var fd = new FormData();
		fd.append('profileName', profile);
		fd.append('operationName', operation.operationName);
		fd.append('file', file);
		fd.append('cwd', operation.cwd);
		fd.append('timeout', operation.timeout);
		fd.append('daemon', operation.daemon);
		fd.append('script', operation.script);
		return $http.post(
			BASE_URL + 'operations/create',
			fd,
			{transformRequest: angular.identity, headers: {'Content-Type': undefined}}
		);
	}

	function updateOperation (operation) {
		var postData = "operationId=" + operation.operationId + "&commandName=" + operation.commandName + "&cwd=" + operation.cwd + "&timeout=" + operation.timeout + "&daemon=" + operation.daemon + "&script=" + operation.script + "&operationName=" + operation.operationName;
		return $http.post (BASE_URL + "operations/update", postData, {withCredentials: true, headers: {'Content-Type': 'application/x-www-form-urlencoded'}});
	}

	function deleteOperation (operationId) {
		return $http.delete (BASE_URL + "operations/" + operationId);
	}

	function getEnvironments() {
		return environmentService.getEnvironments();
	}


	function executeOperation (operationName, lxcHostName, environmentId) {
		var putData = "operationName=" + operationName + "&lxcHostName=" + lxcHostName + "&environmentId=" + environmentId;
		console.log (putData);
		return $http.put (BASE_URL + "execute", putData, {withCredentials: true, headers: {'Content-Type': 'application/x-www-form-urlencoded'}});
	}
}
