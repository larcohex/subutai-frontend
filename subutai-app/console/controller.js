'use strict';

angular.module('subutai.console.controller', [])
	.controller('ConsoleViewCtrl', ConsoleViewCtrl)
	.config(['terminalConfigurationProvider', function (terminalConfigurationProvider) {

		terminalConfigurationProvider.config('modern').outputDelay = 80;
		terminalConfigurationProvider.config('modern').allowTypingWriteDisplaying = false;
		//terminalConfigurationProvider.config('vintage').typeSoundUrl ='example/content/type.wav';
		//terminalConfigurationProvider.config('vintage').startSoundUrl ='example/content/start.wav';
	}]);

ConsoleViewCtrl.$inject = ['$scope', 'consoleService'];

function ConsoleViewCtrl($scope, consoleService) {

	//Console UI
	$scope.theme = 'modern';
	setTimeout(function () {
		$scope.$broadcast('terminal-output', {
			output: true,
			text: [
				'Wake up, Neo...',
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
	//END Console UI


	var vm = this;	
	vm.currentType = 'peer';
	vm.activeConsole = [];
	vm.hosts = [];
	vm.environments = [];
	vm.containers = [];
	vm.currentTab = '';

	consoleService.getResourceHosts().success(function (data) {
		vm.hosts = data;
	});

	consoleService.getEnvironments().success(function (data) {
		vm.environments = data;
	});	

	//functions
	vm.setCurrentType = setCurrentType;
	vm.setConsole = setConsole;
	vm.showContainers = showContainers;
	vm.onClickTab = onClickTab;

	function setConsole(node) {
		if(vm.activeConsole.indexOf(node) == -1) {
			var item = {};
			item.id = node;
			item.url = 'terminal' + (vm.activeConsole.length + 1) + '.html';
			vm.activeConsole.push(item);
		}
	}

	function onClickTab(tab) {
		vm.currentTab = tab.url;
	}

	function isActiveTab(tabUrl) {
		return tabUrl == vm.currentTab;
	}

	function setCurrentType(type) {
		vm.containers = [];
		vm.currentType = type;
	}

	function showContainers(environmentId) {
		vm.containers = [];
		for(var i in vm.environments) {
			if(environmentId == vm.environments[i].id) {
				vm.containers = vm.environments[i].containers;
				console.log(vm.containers);
				break;
			}
		}
	}

}
