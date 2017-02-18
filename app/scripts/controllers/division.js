'use strict';

angular.module('robocupApp')
	.controller('DivisionCtrl', ['$scope', 'Restangular', '$state', 'userRepository', function ($scope, Restangular, $state, userRepository) {
		$scope.user = {};
		userRepository.getUser().then(function(userObject){
			$scope.user = userObject;
		});
		$scope.divisionEndpoint = Restangular.all('division');
		$scope.divisionEndpoint.getList().then(function(divisions){
			$scope.divisions = divisions;
		}, function(error){

		});
}]).controller('DivisionFormCtrl', ['$scope', 'Restangular', '$state', 'userRepository', function ($scope, Restangular, $state, userRepository) {
		$scope.user = {};
		$scope.categories = ['Dance'];
		$scope.action = $state.current.data.action;
		userRepository.getUser().then(function(userObject){
			$scope.user = userObject;
		});
		$scope.divisionEndpoint = Restangular.all('division');
		$scope.scoreSheetEndpoint = Restangular.all('score_sheet');
		$scope.interviewSheets = [];
		$scope.performanceSheets = [];
		$scope.scoreSheetEndpoint.getList().then(function(scoreSheets){
			$scope.interviewSheets = [];
			$scope.performanceSheets = [];
			for ( var i = 0; i < scoreSheets.length; i++ ){
				var scoreSheet = scoreSheets[i];
				if ( scoreSheet.sheetType == 1 ){
					$scope.interviewSheets.push(scoreSheet);
				}else if ( scoreSheet.sheetType == 2){
					$scope.performanceSheets.push(scoreSheet);
				}
			}
		}, function(err){

		});
		if ( $scope.action == 'new' ){
			$scope.division = {
				rounds:[],
				open: true
			};
		}else{
			$scope.divisionEndpoint.one($state.params.divisionId).get().then(function(division){
				$scope.division = division;
			}, function(err){

			});
		}
		$scope.addRound = function(){
			$scope.division.rounds.push({isFinal: false});
		}
		$scope.removeRound = function(round){
			$scope.division.rounds.splice($scope.division.rounds.indexOf(round), 1);
		}
		$scope.back = function(){
			window.history.back();
		}
		$scope.save = function(){
			if ( $scope.action == 'edit' ){
				$scope.divisionEndpoint.one($state.params.divisionId).customPUT($scope.division).then(function(result){
					$scope.back();
				}, function(err){

				});
			}else{
				$scope.divisionEndpoint.post($scope.division).then(function(result){
					$scope.back();
				}, function(err){

				});
			}
		}
		$scope.submitForm = function() {
			// check to make sure the form is completely valid
			if ($scope.divisionForm.$valid) {
				$scope.save();
			}
		};
}]);
