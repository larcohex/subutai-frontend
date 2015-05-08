/**
 * Created by ubuntu on 5/7/15.
 */
angular.module('subutai.identity.controller',[])
    .controller('IdentityTableCtrl', IdentityTableCtrl);

IdentityTableCtrl.$inject = ['$scope', '$http'];
function IdentityTableCtrl($scope, $http) {
    $http.get("subutai-app/identity/users.json").success(function (res) {
        $scope.users = res.users;
        $scope.roles = res.roles;
    })
}