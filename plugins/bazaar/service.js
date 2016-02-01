'use strict';

angular.module ('subutai.plugins.bazaar.service',[])
	.factory ('bazaarSrv', bazaarSrv);

bazaarSrv.$inject = ['$http'];

function bazaarSrv ($http) {
	var BASE_URL = SERVER_URL + "rest/bazaar/";

	var bazaarSrv = {
		getPlugins: getPlugins
	};
	return bazaarSrv;


	function getPlugins() {
		return $http.get (BASE_URL + "plugins", {withCredentials: true, headers: {'Content-Type': 'application/json'}});
	}
}