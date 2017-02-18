'use strict';

angular.module('robocupApp')
	.controller('DanceCtrl', ['$scope', 'Restangular', '$state', 'userRepository', function ($scope, Restangular, $state, userRepository) {
		$scope.user = {};
		userRepository.getUser().then(function(userObject){
			$scope.user = userObject;
		});
		$scope.category = $state.current.data.category;
		$scope.danceEndpoint = Restangular.all('ladders');
		$scope.danceEndpoint.getList().then(function(results){
			$scope.danceResults = results;
			console.log($scope.danceResults);
		}, function(err){

		});
		$scope.roundMatch = function(team, round){
			var zeroRound = null;
			if ( round.isFinal ){
				if ( team.finals != null ){
					zeroRound = team.finals[round.id];
				}
			}else{
				zeroRound = team.rounds[round.id];
			}
			if ( zeroRound == null ){
				zeroRound = {average: 0.0};
			}
			var performanceCount = 0;
			if (zeroRound.performanceCount !== undefined) {
				performanceCount = zeroRound.performanceCount;
			}
			return zeroRound.average.toFixed(2).toString() + " (" + performanceCount + ")";
		}
}]).controller('DanceInterviewFormCtrl', ['$scope', 'Restangular', '$state', 'userRepository', function ($scope, Restangular, $state, userRepository) {
		$scope.user = {};
		userRepository.getUser().then(function(userObject){
			$scope.user = userObject;
		});
		$scope.category = $state.current.data.category;
		$scope.danceInterviewEndpoint = Restangular.all('dance_interview');
		$scope.teamEndpoint = Restangular.all('team');
		if ( $scope.category == 'dance' ){
			$scope.teamParameters = {category: 'Dance'};
		}else{
			$scope.teamParameters = {category: 'Dance Theatre'};
		}
		$scope.teamEndpoint.getList($scope.teamParameters).then(function(teams){
			$scope.teams = teams;
		}, function(error){

		});
		$scope.back = function(){
			window.history.back();
		}
		$scope.action = $state.current.data.action;
		$scope.criteriaEndpoint = Restangular.all('dance_interview/criteria');
		$scope.criteriaEndpoint.getList().then(function(criteria){
			$scope.criteriaItems = criteria;
			if ( $scope.action == 'new' ){
				$scope.interview = {};
				for ( var i = 0; i < $scope.criteriaItems.length; i++ ){
					for ( var j = 0; j < $scope.criteriaItems[i].items.length; j++ ){
						$scope.criteriaItems[i].items[j].value = 0;
					}
				}
			}else{
				$scope.danceInterviewEndpoint.one($state.params.danceInterviewId).get().then(function(interview){
					$scope.interview = interview;
					$scope.interview.team = $scope.interview.team.id;
					for ( var i = 0; i < $scope.criteriaItems.length; i++ ){
						for ( var j = 0; j < $scope.criteriaItems[i].items.length; j++ ){
							var item = $scope.criteriaItems[i].items[j];
							item.value = $scope.interview[item.modelAttribute];
						}
					}
				}, function(err){

				});
			}
		}, function(error){

		});

		$scope.submitForm = function() {
			// check to make sure the form is completely valid
			if ($scope.interviewForm.$valid) {
				$scope.save();
			}
		};

		$scope.save = function(){
			var submission = {};
			for ( var i = 0; i < $scope.criteriaItems.length; i++ ){
				for ( var j = 0; j < $scope.criteriaItems[i].items.length; j++ ){
					var criteriaItem = $scope.criteriaItems[i].items[j];
					submission[criteriaItem.modelAttribute] = criteriaItem.value;
				}
			}
			submission.team = $scope.interview.team;
			submission.comments = $scope.interview.comments;
			if ( $scope.action == 'new' ){
				$scope.danceInterviewEndpoint.post(submission).then(function(result){
					$scope.back();
				}, function(err){

				});
			}else{
				$scope.danceInterviewEndpoint.one($scope.interview.id).customPUT(submission).then(function(result){
					$scope.back();
				}, function(err){

				})
			}
		}
}]).controller('DancePerformanceFormCtrl', ['$scope', 'Restangular', '$state', 'userRepository', function ($scope, Restangular, $state, userRepository) {
		$scope.user = {};
		userRepository.getUser().then(function(userObject){
			$scope.user = userObject;
		});
		$scope.category = $state.current.data.category;
		$scope.validTeams = [];
		$scope.dancePerformanceEndpoint = Restangular.all('dance_performance');
		$scope.teamEndpoint = Restangular.all('team');

		$scope.teamConditions = null;
		if ( $scope.category == 'Dance' ){
			$scope.teamConditions = {category: 'Dance'};
		}else{
			$scope.teamConditions = {category: 'Dance Theatre'};
		}

		$scope.teamEndpoint.getList($scope.teamConditions).then(function(teams){
			$scope.teams = teams;
		}, function(error){

		});
		$scope.back = function(){
			window.history.back();
		}
		$scope.roundSelected = function(){

			for ( var i = 0; i < $scope.rounds.length; i++ ){
				var round = $scope.rounds[i];

				if ( round.id == $scope.performance.round ){
					var division = round.division;
					$scope.performance.division = division.id;
					var validTeams = [];
					for ( var j = 0; j < $scope.teams.length; j++ ){
						var team = $scope.teams[j];
						if ( team.division.id == division.id ){
							validTeams.push(team);
						}
					}
					$scope.validTeams = validTeams;
					break;
				}
			}
		}
		$scope.divisionEndpoint = Restangular.all('division');
		$scope.divisionEndpoint.getList().then(function(divisions){
			$scope.divisions = divisions;
			var validRounds = [];
			for ( var i = 0; i < $scope.divisions.length; i++ ){
				var division = $scope.divisions[i];
				if ( division.category == $scope.category ){
					if ( division.rounds != null ){
						for ( var j = 0; j < division.rounds.length; j++ ){
							var round = division.rounds[j];
							var groupHeading = division.name;
							var name = null;
							if ( round.isFinal ){
								groupHeading += ' Finals';
								name = 'Final ' + round.order.toString()
							}else{
								name = 'Round ' + round.order.toString()
							}
							validRounds.push({
								id: round.id,
								order: round.order,
								isFinal: round.isFinal,
								division: division,
								round: round,
								grouping: groupHeading,
								name: name
							});
						}
					}
				}
			}
			$scope.rounds = validRounds;
			if ( $scope.action != 'new' ){
				$scope.dancePerformanceEndpoint.one($state.params.dancePerformanceId).get().then(function(remotePerformance){
					$scope.performance = remotePerformance;
					for ( var i = 0; i < $scope.criteriaItems.length; i++ ){
						for ( var j = 0; j < $scope.criteriaItems[i].items.length; j++ ){
							var item = $scope.criteriaItems[i].items[j];
							item.value = $scope.performance[item.modelAttribute];
						}
					}
					$scope.roundSelected();
				}, function(err){

				});
			}

		}, function(error){

		});
		$scope.action = $state.current.data.action;
		if ($scope.category == 'Dance' ){
			$scope.criteriaEndpoint = Restangular.all('dance/criteria');
		}else{
			$scope.criteriaEndpoint = Restangular.all('dance_theatre/criteria');
		}

		$scope.criteriaEndpoint.getList().then(function(criteria){
			$scope.criteriaItems = criteria;
			if ( $scope.action == 'new' ){
				$scope.performance = {};
				for ( var i = 0; i < $scope.criteriaItems.length; i++ ){
					for ( var j = 0; j < $scope.criteriaItems[i].items.length; j++ ){
						$scope.criteriaItems[i].items[j].value = 0;
					}
				}
			}else{

			}
		}, function(error){

		});

		$scope.submitForm = function() {
			// check to make sure the form is completely valid
			if ($scope.performanceForm.$valid) {
				$scope.save();
			}
		};

		$scope.save = function(){
			var submission = {};
			for ( var i = 0; i < $scope.criteriaItems.length; i++ ){
				for ( var j = 0; j < $scope.criteriaItems[i].items.length; j++ ){
					var criteriaItem = $scope.criteriaItems[i].items[j];
					submission[criteriaItem.modelAttribute] = criteriaItem.value;
				}
			}
			submission.team = $scope.performance.team;
			submission.round = $scope.performance.round;
			submission.setupTime = $scope.performance.setupTime;
			submission.danceTime = $scope.performance.danceTime;
			submission.packupTime = $scope.performance.packupTime;
			submission.comments = $scope.performance.comments;
			submission.division = $scope.performance.division;
			if ( $scope.action == 'new' ){
				$scope.dancePerformanceEndpoint.post(submission).then(function(result){
					$scope.back();
				}, function(err){

				});
			}else{
				$scope.dancePerformanceEndpoint.one($scope.performance.id).customPUT(submission).then(function(result){
					$scope.back();
				}, function(err){

				});
			}
		}
}]);
