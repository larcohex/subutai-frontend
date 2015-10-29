'use strict';

angular.module('subutai.console.controller', ['vtortola.ng-terminal'])
.controller('consoleViewCtrl', consoleViewCtrl)
.config(['terminalConfigurationProvider', function (terminalConfigurationProvider) {

	terminalConfigurationProvider.config('modern').outputDelay = 80;
	terminalConfigurationProvider.config('modern').allowTypingWriteDisplaying = false;
	//terminalConfigurationProvider.config('vintage').typeSoundUrl ='example/content/type.wav';
	//terminalConfigurationProvider.config('vintage').startSoundUrl ='example/content/start.wav';
}]);

consoleViewCtrl.$inject = ['$scope', 'consoleService'];

function consoleViewCtrl($scope, consoleService) {
	$scope.test = getTestComand;

	$scope.theme = 'modern';

	setTimeout(function () {
		$scope.$broadcast('terminal-output', {
			output: true,
			text: [
				'Wake up, Neo...',
				//'The Matrix has you...',
				//'Follow the white rabbit...',
				//'Knock, knock, Neo.',
			],
			breakLine: true
		});
		$scope.$apply();
	}, 100);

	$scope.session = {
		commands: [],
		output: [],
		$scope:$scope
	};

	$scope.$watchCollection(function () { return $scope.session.commands; }, function (n) {
		for (var i = 0; i < n.length; i++) {
			$scope.$broadcast('terminal-command', n[i]);
		}
		$scope.session.commands.splice(0, $scope.session.commands.length);
		$scope.$$phase || $scope.$apply();
	});

	$scope.$watchCollection(function () { return $scope.session.output; }, function (n) {
		for (var i = 0; i < n.length; i++) {
			$scope.$broadcast('terminal-output', n[i]);
		}
		$scope.session.output.splice(0, $scope.session.output.length);
		$scope.$$phase || $scope.$apply();
	});

	$scope.$on('terminal-input', function (e, consoleInput) {
		var cmd = consoleInput[0];

		try {
			console.log(cmd);
		} catch (err) {
			$scope.session.output.push({ output: true, breakLine: true, text: [err.message] });
		}
	});

	function getTestComand() {
		consoleService.getTestComand().success(function (data) {
		}).error(function () {
			$scope.status = "Could not get Resource hosts";
		});
	}

}
