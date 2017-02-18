'use strict';

angular.module('robocupApp')
	.controller('ScoreCtrl', ['$scope', 'Restangular', '$state', 'userRepository', '$q', function ($scope, Restangular, $state, userRepository, $q) {
    $scope.action = $state.current.data.action;
		$scope.user = {};
		userRepository.getUser().then(function(userObject){
			$scope.user = userObject;
		});

    $scope.scoreSheet = null;
    $scope.teamEndpoint = Restangular.all('team');
    $scope.divisionEndpoint = Restangular.all('division');
		$scope.scoreSheetEndpoint = Restangular.all('score_sheet');
    //we have the division, so we can populate the rounds and teams
    //skip the rounds if its an interview score sheet

		$scope.division = null;
		$scope.rounds = [];
		$scope.teams = [];

		$scope.sectionTotal = function(section){
			var total = 0.0;
			for ( var i = 0; i < section.scores.length; i++ ){
				var score = section.scores[i];
				if (score.recordedValue != null){
					total += score.recordedValue;
				}
			}
			return total;
		}

		$scope.fetchData = function(){
			//fetches the current division (includes rounds) and teams in that div
			//along with the score sheet thats required
			var divProm = $scope.divisionEndpoint.one($state.params.divisionId).get();
			var teamProm = $scope.teamEndpoint.getList({division: $state.params.divisionId});
			$q.all([divProm, teamProm]).then(function(results){
				$scope.division = results[0];
				$scope.teams = results[1];
				console.log($scope.division, $scope.teams);
			}, function(err){

			});
		}

		$scope.fetchData();

	$scope.getUuid = function() {
		var uuid = "", i, random;
		for (i = 0; i < 32; i++) {
			random = Math.random() * 16 | 0;
			if (i == 8 || i == 12 || i == 16 || i == 20) {
				uuid += "-"
			}
			uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
		}
		return uuid;
	}

    if ( $scope.action == 'new' ){
      $scope.scoreSheetEndpoint.one($state.params.scoreSheetTemplateId).get().then(function(scoreSheetTemplate){
  			$scope.scoreSheetTemplate = scoreSheetTemplate;
        $scope.scoreSheet = {
        	id: $scope.getUuid(),
          sections:[],
					timings:[],
					scoreType: $scope.scoreSheetTemplate.sheetType,
					division: $state.params.divisionId
        };
        for ( var i = 0; i < $scope.scoreSheetTemplate.sections.length; i++ ){
          var section = $scope.scoreSheetTemplate.sections[i];
          var scoreSheetSection = {
            description: section.description,
            scores:[]
          }
          for ( var j = 0; j < section.criteria.length; j++ ){
            var crit = section.criteria[j];
            var sectionScore = {
              description: crit.description,
              guide: crit.guide,
              maxValue: crit.maxValue,
              recordedValue: 0.0
            }
            scoreSheetSection.scores.push(sectionScore);
          }
          $scope.scoreSheet.sections.push(scoreSheetSection);
        }
				for ( var i = 0; i < $scope.scoreSheetTemplate.timings.length; i++ ){
					var timing = $scope.scoreSheetTemplate.timings[i];
					$scope.scoreSheet.timings.push({
						name: timing,
						value: null
					});
				}
  		}, function(err){

  		});
    }else if ( $scope.action == 'edit' ){
			Restangular.all('score').one($state.params.scoreSheetId).get().then(function(scoreSheet){
				$scope.scoreSheet = scoreSheet;
			}, function(err){

			});
    }

		$scope.back = function(){
			window.history.back();
		}

		$scope.save = function(){
			if ( $scope.action == 'edit' ){
				Restangular.all('score').one($state.params.scoreSheetId).customPUT($scope.scoreSheet).then(function(result){
					$scope.back();
				}, function(err){

				});
			}else{
				$scope.scoreSheet.user = $scope.user['id'];
				Restangular.all('score').post($scope.scoreSheet).then(function(result){
					$scope.back();
				}, function(err){

				});
			}
		}
		$scope.submitForm = function() {
			// check to make sure the form is completely valid
			if ($scope.scoreForm.$valid) {
				$scope.save();
			}
		};

}]);
