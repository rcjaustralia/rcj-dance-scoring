'use strict';

angular.module('robocupApp')
	.controller('UserCtrl', ['$scope', 'Restangular', '$state', 'userRepository', function ($scope, Restangular, $state, userRepository) {
		$scope.user = {};
		userRepository.getUser().then(function(userObject){
			$scope.user = userObject;
		});
		$scope.userEndpoint = Restangular.all('users');
		$scope.userEndpoint.getList().then(function(users){
			$scope.users = users;
		}, function(error){

		});
}]).controller('UserFormCtrl', ['$scope', 'Restangular', '$state', 'userRepository', function ($scope, Restangular, $state, userRepository) {
		$scope.user = {};
		$scope.action = $state.current.data.action;
		userRepository.getUser().then(function(userObject){
			$scope.user = userObject;
		});
		$scope.userEndpoint = Restangular.all('users');
		if ( $scope.action == 'new' ){
			$scope.userObj = {isBen: false};
		}else{
			$scope.userEndpoint.one($state.params.userId).get().then(function(result){
				$scope.userObj = result;
			}, function(err){

			});
		}
		$scope.back = function(){
			window.history.back();
		}
		$scope.save = function(){
			if ( $scope.action == 'edit' ){
				$scope.userEndpoint.one($state.params.teamId).customPUT($scope.userObj).then(function(result){
					$scope.back();
				}, function(err){

				});
			}else{
				$scope.userEndpoint.post($scope.userObj).then(function(result){
					$scope.back();
				}, function(err){

				});
			}
		}
		$scope.submitForm = function() {
			// check to make sure the form is completely valid
			if ($scope.userForm.$valid) {
				$scope.save();
			}
		};
}]).controller('UserSubmissionListCtrl', ['$scope', 'Restangular', '$state', 'userRepository', function ($scope, Restangular, $state, userRepository) {
		$scope.user = {};
		$scope.scoreEndpoint = Restangular.all('score');
		$scope.performances = [];
		$scope.interviews = [];

		$scope.scoreEndpoint.getList({user: $scope.user['id'], detailed: 'true'}).then(function(scores){
			for ( var i = 0; i < scores.length; i++ ){
				var score = scores[i];
				if ( score.scoreType == 1 ){
					$scope.interviews.push(score);
				}else{
					$scope.performances.push(score);
				}
			}
		}, function(err){

		});

		$scope.getRound = function(performance) {
			if ((performance.round === null) || (performance.round === undefined)) {
				return "";
			}
			var division = performance.division;
			var rounds = division.rounds;
			for (var i = 0; i < rounds.length; i++ ) {
				if (rounds[i].id === performance.round) {
					if (rounds[i].isFinal) {
						return "Final " + rounds[i].order.toString()
					} else {
						return "Round " + rounds[i].order.toString()
					}
				}
			}
			return "";
		}

		userRepository.getUser().then(function(userObject){
			$scope.user = userObject;
		});

}]);
