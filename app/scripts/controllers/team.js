'use strict';

angular.module('robocupApp')
	.controller('TeamCtrl', ['$scope', 'Restangular', '$state', 'userRepository', function ($scope, Restangular, $state, userRepository) {
		$scope.user = {};
		userRepository.getUser().then(function(userObject){
			$scope.user = userObject;
		});
		$scope.teamEndpoint = Restangular.all('team');
		$scope.teamEndpoint.getList().then(function(teams){
			$scope.teams = teams;
		}, function(error){

		});
}]).controller('TeamDetailCtrl', ['$scope', 'Restangular', '$state', 'userRepository', function ($scope, Restangular, $state, userRepository) {
		$scope.user = {};
		$scope.performances = [];
		$scope.interviews = [];
		userRepository.getUser().then(function(userObject){
			$scope.user = userObject;
		});
		$scope.teamEndpoint = Restangular.all('team');
		$scope.scoreEndpoint = Restangular.all('score');

		$scope.teamEndpoint.one($state.params.teamId).get().then(function(team){
			$scope.team = team;
		}, function(err){

		});

		$scope.scoreEndpoint.getList({team: $state.params.teamId, detailed: 'true'}).then(function(scores){
			for ( var i = 0; i < scores.length; i++ ){
				var score = scores[i];
				if ( score.scoreType == 1 ){
					$scope.interviews.push(score);
				}else{
					for (var j = 0; j < score.division.rounds.length; j++ ) {
						if (score.division.rounds[j].id === score.round) {
							score.round = score.division.rounds[j];
							if (score.round.isFinal) {
								score.round.name = "Final " + score.round.order.toString();
							} else {
								score.round.name = "Round " + score.round.order.toString();
							}
						}
					}
					$scope.performances.push(score);
				}
			}
		}, function(err){

		});
		
}]).controller('TeamFormCtrl', ['$scope', 'Restangular', '$state', 'userRepository', function ($scope, Restangular, $state, userRepository) {
		$scope.user = {};
		$scope.action = $state.current.data.action;
		userRepository.getUser().then(function(userObject){
			$scope.user = userObject;
		});
		$scope.divisionEndpoint = Restangular.all('division');
		$scope.teamEndpoint = Restangular.all('team');
		$scope.divisionEndpoint.getList().then(function(divisions){
			$scope.divisions = divisions;
		}, function(error){

		});
		if ( $scope.action == 'new' ){
			$scope.team = {};
		}else{
			$scope.teamEndpoint.one($state.params.teamId).get().then(function(team){
				$scope.team = team;
				$scope.team.division = $scope.team.division.id;
			}, function(err){

			});
		}
		$scope.back = function(){
			window.history.back();
		}
		$scope.save = function(){
			var submission = {};
			submission.name = $scope.team.name;
			submission.school = $scope.team.school;
			submission.division = $scope.team.division;
			if ( $scope.action == 'edit' ){
				$scope.teamEndpoint.one($state.params.teamId).customPUT(submission).then(function(result){
					$scope.back();
				}, function(err){

				});
			}else{
				$scope.teamEndpoint.post(submission).then(function(result){
					$scope.back();
				}, function(err){

				});
			}
		}
		$scope.submitForm = function() {
			// check to make sure the form is completely valid
			if ($scope.teamForm.$valid) {
				$scope.save();
			}
		};
}]);
