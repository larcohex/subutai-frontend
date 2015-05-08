/**
 * Created by ubuntu on 5/7/15.
 */
angular.module('subutai.identity.controller',[])
    .controller('IdentityTableCtrl', IdentityTableCtrl);

IdentityTableCtrl.$inject = ['$scope'];
function IdentityTableCtrl($scope) {
    $http.get("users.json").success(function (res) {
        $scope.users = res;
    })
}