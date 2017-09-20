'use strict';

angular.module('robocupApp')
	.controller('ScoreSheetCtrl', ['$scope', 'Restangular', '$state', 'userRepository', function ($scope, Restangular, $state, userRepository) {
		$scope.user = {};
		userRepository.getUser().then(function(userObject){
			$scope.user = userObject;
		});
		$scope.scoreSheetEndpoint = Restangular.all('score_sheet');
		$scope.scoreSheetEndpoint.getList().then(function(sheets){
			$scope.scoreSheets = sheets;
		}, function(error){

		});
}]).controller('ScoreSheetFormCtrl', ['$scope', 'Restangular', '$state', 'userRepository', function ($scope, Restangular, $state, userRepository) {
		$scope.user = {};
		$scope.sheetTypes = [{
			id: 1,
			name: 'Interview'
		},{
			id: 2,
			name: 'Performance'
		}];
		$scope.selectedSheetType = null;
		$scope.action = $state.current.data.action;
		userRepository.getUser().then(function(userObject){
			$scope.user = userObject;
		});
		$scope.scoreSheetEndpoint = Restangular.all('score_sheet');
		if ( $scope.action == 'new' ){
			$scope.scoreSheet = {
				enabled: false,
				sections:[],
				timings:[]
			};
		}else{
			$scope.scoreSheetEndpoint.one($state.params.scoreSheetId).get().then(function(scoreSheet){
				$scope.scoreSheet = scoreSheet;
				$scope.selectedSheetType = $scope.sheetTypes[$scope.scoreSheet.sheetType - 1];
			}, function(err){

			});
		}

		$scope.addTiming = function(timingText){
			$scope.scoreSheet.timings.push(timingText);
			$scope.newTimingText = '';
		}

		$scope.removeTiming = function(timingText){
			$scope.scoreSheet.timings.splice($scope.scoreSheet.timings.indexOf(timingText), 1);
		}

		$scope.addSection = function(){
			$scope.scoreSheet.sections.push({
				criteria:[]
			})
		}

		$scope.removeSection = function(section){
			$scope.scoreSheet.sections.splice($scope.scoreSheet.sections.indexOf(section), 1);
		}

		$scope.addCriteria = function(section){
			section.criteria.push({});
		}

		$scope.removeCriteria = function(section, criteria){
			section.criteria.splice(section.criteria.indexOf(section), 1);
		}

		$scope.back = function(){
			window.history.back();
		}

		$scope.save = function(){
			$scope.scoreSheet.sheetType = $scope.selectedSheetType.id
			if ( $scope.action == 'edit' ){
				$scope.scoreSheetEndpoint.one($state.params.scoreSheetId).customPUT($scope.scoreSheet).then(function(result){
					$scope.back();
				}, function(err){

				});
			}else{
				$scope.scoreSheetEndpoint.post($scope.scoreSheet).then(function(result){
					$scope.back();
				}, function(err){

				});
			}
		}
		$scope.submitForm = function() {
			// check to make sure the form is completely valid
			if ($scope.scoreSheetForm.$valid) {
				$scope.save();
			}
		};
}]);
