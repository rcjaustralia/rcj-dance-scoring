'use strict';

angular.module('robocupApp')
	.factory('userRepository', ['$q', 'Restangular', 
	'$timeout', '$rootScope', function ($q, Restangular, $timeout, $rootScope) {
		var cachedUserObject = null;
		var fetchingUser = false;
		var userEndpoint = Restangular.one('user');
		var pingEndpoint = Restangular.one('ping');
		var outstanding = [];
		var pingCallback = null;
		var currentTimeout = null;
		function queuePing() {
			return $timeout(function() {
				currentTimeout = null;
				pingEndpoint.get()
				.then(function(ping) {
					if (pingCallback !== null) {
						pingCallback(true);
					}
					currentTimeout = queuePing();
				}).catch(function(err) {
					if (pingCallback !== null) {
						pingCallback(false);
					}
					currentTimeout = queuePing();
				})
			}, 10000);
		}
		currentTimeout = queuePing();
		function setPingCallback(callback) {
			pingCallback = callback;
		}
		function getUser(forceRefresh){
			var deferred = $q.defer();
			if (( cachedUserObject == null ) || ( forceRefresh )){
				if ( fetchingUser ){
					outstanding.push(deferred);
					return deferred.promise;
				}
				fetchingUser = true;
				userEndpoint.get().then(function(userObject){
					cachedUserObject = userObject;
					deferred.resolve(cachedUserObject);
					for ( var i = 0 ; i < outstanding.length; i++ ){
						outstanding[i].resolve(cachedUserObject);
					}
					outstanding.splice(0);
					fetchingUser = false;
				}, function(err){
					deferred.reject(err);
					fetchingUser = false;
				});
			}else{
				deferred.resolve(cachedUserObject);
			}
			return deferred.promise;
		}
		return {
			getUser: getUser,
			setPingCallback: setPingCallback
		};
}]);