'use strict';

angular.module('subutai.plugins.keshig.service', [])
	.factory('keshigSrv', keshigSrv);

keshigSrv.$inject = ['$http'];

function keshigSrv($http) {

	var baseURL = serverUrl + 'v1/keshig/';
	var serversUrl = baseURL + 'server/';
	var optionUrl = baseURL + 'option/';
	var profilesUrl = baseURL + 'profiles/';

	var resourceHostsURL = serverUrl + 'command_ui/resource_hosts/';


	var keshigSrv = {
		getResourceHosts : getResourceHosts,
		getProfiles : getProfiles,
		addProfile : addProfile,
		removeProfile : removeProfile,
		getServers : getServers,
		addServer : addServer,
		removeServer : removeServer,
		updateServer : updateServer,
		getServerTypes : getServerTypes,
		getAllOptions : getAllOptions,
		getOptionTypes : getOptionTypes,
		getOptionsByType : getOptionsByType,
		startOption : startOption,
		addOption : addOption,
		updateOption : updateOption
	};

	return keshigSrv;

	/*
	 *   Keshig Server Services
	 * */

	function getResourceHosts() {
		return $http.get(resourceHostsURL, {withCredentials: true, headers: {'Content-Type': 'application/json'}});
	}

	function getProfiles()
	{
		return $http.get(profilesUrl, {
			withCredentials: true
		});
	}

	function addProfile( profile )
	{
		return $http.post(profilesUrl, profile, {
			withCredentials: true,
			headers: {'Content-Type': 'application/json'}
		});
	}

	function removeProfile( name )
	{
		return $http.delete(profilesUrl + name, {
			withCredentials: true
		});
	}

	function getServers()
	{
		return $http.get(serversUrl, {
			withCredentials: true
		});
	}

	function addServer( server )
	{
		return $http.post(serversUrl, server, {
			withCredentials: true,
			headers: {'Content-Type': 'application/json'}
		});
	}

	function removeServer(id)
	{
		return $http.remove(serversUrl + id, {
			withCredentials: true
		});
	}


	function getServerTypes() {
		return $http.get(serversUrl + 'types', {
			withCredentials: true
		});
	}


	function updateServer( server ) {
		return $http.put(serversUrl, server, {
			withCredentials: true,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});
	}

	function getAllOptions() {
		return $http.get(optionUrl, {
			withCredentials: true
		});
	}

	function getOptionTypes() {
		return $http.get(optionUrl + 'types', {
			withCredentials: true
		});
	}

	function getOptionsByType(type) {
		return $http.get(optionUrl + 'type/' + type, {
			withCredentials: true
		});
	}

	function startOption(type, optionName) {
		return $http.get(optionUrl + type + '/' + optionName + '/' + 'start', {
			withCredentials: true
		});
	}

	function addOption( type, object )
	{
		return $http.post(optionUrl + type.toLowerCase(), object, {
			withCredentials: true,
			headers: {'Content-Type': 'application/json'}
		});
	}

	function updateOption( type, object )
	{
		return $http.put(optionUrl + type.toLowerCase(), object, {
			withCredentials: true,
			headers: {'Content-Type': 'application/json'}
		});
	}
}
