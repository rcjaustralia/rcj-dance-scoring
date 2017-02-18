'use strict';

angular.module('robocupApp')
  .controller('NavCtrl', ['$scope', '$state', 'userRepository', function ($scope, $state, userRepository) {
	$scope.currentState = $state.current;
	$scope.user = {};
	$scope.pingSuccess = true;
	userRepository.setPingCallback(function(result){
		$scope.pingSuccess = result;
	});
	userRepository.getUser().then(function(userObject){
		$scope.user = userObject;
	});
}]);
