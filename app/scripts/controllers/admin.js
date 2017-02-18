'use strict';

angular.module('robocupApp')
	.controller('AdminCtrl', ['$scope', 'Restangular', '$state', 'userRepository', function ($scope, Restangular, $state, userRepository) {
		$scope.user = {};
		userRepository.getUser().then(function(userObject){
			$scope.user = userObject;
		});;


		
}]);