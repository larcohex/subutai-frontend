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

		listOperations: listOperations
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

/*	function saveOperation (profile) {

	}*/
}
