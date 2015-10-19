'use strict';

angular.module('subutai.identity.controller', [])
    .controller('IdentityCtrl', IdentityCtrl)
    .controller('DataReloadWithPromiseCtrl', DataReloadWithPromiseCtrl);;

IdentityCtrl.$inject = ['identitySrv'];
DataReloadWithPromiseCtrl.$inject = [
	'identitySrv',
	'$scope',
	'$compile',
	'$resource',
	'DTOptionsBuilder',
	'DTColumnBuilder'
];

function IdentityCtrl(identitySrv) {
    var vm = this;

    vm.addPane = addPane;
    vm.closePane = closePane;

    vm.isUser = true;
    vm.isRole = false;
    vm.isToken = false;

    identitySrv.getRoles().success(function (data) {
        vm.roles = data;
    });

    identitySrv.getTokens().success(function (data) {
        vm.tokens = data;
    });

    //// Implementation

    function addPane(z) {
        jQuery('#resizable-pane').removeClass('fullWidthPane');
        if( vm.isUser ) {
            jQuery('#role-form').css('display', 'none');
            jQuery('#token-form').css('display', 'none');
            jQuery('#user-form').css('display', 'block');
            jQuery('#role-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#token-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#user-form').removeClass('bounceOutRight');
            jQuery('#user-form').addClass('animated bounceInRight');
        }
        else if( vm.isRole ) {
            jQuery('#user-form').css('display', 'none');
            jQuery('#token-form').css('display', 'none');
            jQuery('#role-form').css('display', 'block');
            jQuery('#user-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#token-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#role-form').removeClass('bounceOutRight');
            jQuery('#role-form').addClass('animated bounceInRight');
        }
        else if( vm.isToken ) {
            jQuery('#user-form').css('display', 'none');
            jQuery('#role-form').css('display', 'none');
            jQuery('#token-form').css('display', 'block');
            jQuery('#user-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#role-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#token-form').removeClass('bounceOutRight');
            jQuery('#token-form').addClass('animated bounceInRight');
        }
    }

    function closePane() {
        jQuery('#resizable-pane').addClass('fullWidthPane');
        if( vm.isUser ) {
            jQuery('#user-form').addClass('bounceOutRight');
            jQuery('#user-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#user-form').css('display', 'none');
        }
        else if( vm.isRole ) {
            jQuery('#role-form').addClass('bounceOutRight');
            jQuery('#role-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#role-form').css('display', 'none');
        }
        else if( vm.isToken ) {
            jQuery('#token-form').addClass('bounceOutRight');
            jQuery('#token-form').removeClass('animated bounceOutRight bounceInRight');
            jQuery('#token-form').css('display', 'none');
        }
    }
}


/*function DataReloadWithPromiseCtrl(identitySrv, $scope, $compile, $resource, DTOptionsBuilder, DTColumnBuilder) {

	var vm = this;
    vm.message = '';
    vm.edit = edit;
    vm.delete = deleteRow;
    vm.dtInstance = {};
    vm.users = {};

    vm.dtOptions = DTOptionsBuilder
		.fromSource('subutai-app/identity/dummy-api/data1.json')
        .withPaginationType('full_numbers')
        .withOption('createdRow', createdRow);

    vm.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name'),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name'),
        DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
            .renderWith(actionsHtml)
    ];

    function edit(users) {
        vm.message = 'You are trying to edit the row: ' + JSON.stringify(users);
        // Edit some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        vm.dtInstance.reloadData();
    }

    function deleteRow(users) {
        vm.message = 'You are trying to remove the row: ' + JSON.stringify(users);
        // Delete some data and call server to make changes...
        // Then reload the data so that DT is refreshed
        vm.dtInstance.reloadData();
    }

    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
    }

    function actionsHtml(data, type, full, meta) {
        vm.users[data.id] = data;
        return '<button class="btn btn-warning" ng-click="showCase.edit(showCase.users[' + data.id + '])">' +
            '   <i class="fa fa-edit"></i>' +
            '</button>&nbsp;' +
            '<button class="btn btn-danger" ng-click="showCase.delete(showCase.users[' + data.id + '])" )"="">' +
            '   <i class="fa fa-trash-o"></i>' +
            '</button>';
    }

	vm.newPromise = newPromise;
    vm.reloadData = reloadData;

    function newPromise() {
        return $resource('subutai-app/identity/dummy-api/data1.json').query().$promise;
    }

    function reloadData() {
        var resetPaging = true;
        vm.dtInstance.reloadData(dataTableCallback, resetPaging);
    }

    function dataTableCallback(json) {
        console.log(json);
    }

}*/

DataReloadWithPromiseCtrl.$inject = ['identitySrv', 'DTOptionsBuilder', 'DTColumnDefBuilder', '$resource'];

function DataReloadWithPromiseCtrl(identitySrv, DTOptionsBuilder, DTColumnDefBuilder, $resource) {
	var vm = this;
	vm.person2Add = {};

	identitySrv.getUsers().success(function (data) {
		vm.users = data;
	});	

	vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers');
    vm.dtInstance = {};	
	vm.dtColumnDefs = [
		DTColumnDefBuilder.newColumnDef(0),
		DTColumnDefBuilder.newColumnDef(1),
		DTColumnDefBuilder.newColumnDef(2),
	];
	vm.addPerson = addPerson;

	function addPerson() {
		vm.users.push(angular.copy(vm.person2Add));
		//console.log(vm.users);
	}
}
