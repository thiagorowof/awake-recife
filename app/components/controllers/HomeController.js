'use strict';

// angular.module('mostPopularListingsApp.home', ['ngRoute'])
//
// // Routing configuration for this module
// .config(['$routeProvider',function($routeprovider, $locationProvider, myService){
// 	$routeprovider.when('/home', {
// 		controller: 'HomeController',
// 		templateUrl: 'components/views/homeView.html'
// 	});
// }])

// Controller definition for this module
mostPopularListingsApp.controller('HomeController', ['$scope', 'myService','$timeout', function($scope, myService, $timeout) {

	// Just a housekeeping.
	// In the init method we are declaring all the
	// neccesarry settings and assignments to be run once
	// controller is invoked
	init();

	var yourSharedData;

	function init(){

        firebase.database().ref('bands').on('value', function(snapshot) {
        	var bands = [],
        		currentBandScore = 0,
						currentName = "",
        		currentBandName = "",
						currentImage = "",
						currentGender = "",
						currentShowtime = "",
						currentIdNumber = "",
						currentStatus = "",
        		currentCrowdMov = 0;

			snapshot.forEach(function(data) {
				bands.push({"name": data.key, "bandname": data.val().bandname, "image": data.val().image, "idNumber": data.val().idNumber, "gender": data.val().gender, "showtime": data.val().showtime, "score": data.val().score, "status": data.val().status});
				if(data.val().status === "presenting"){
					currentBandScore = data.val().score,
        			currentName = data.key,
							currentBandName = data.val().bandname,
							currentImage = data.val().image,
							currentIdNumber = data.val().idNumber,
							currentGender = data.val().gender,
							currentShowtime = data.val().showtime,
							currentStatus = data.val().status,
        			currentCrowdMov = data.val().crowdMov;

				}
			});
			$timeout(function() {
			    $scope.bands = bands;
			    $scope.currentBandScore = currentBandScore;
					$scope.currentName = currentName;
			    $scope.currentBandName = currentBandName;
			    $scope.currentCrowdMov = currentCrowdMov;
					$scope.currentImage = currentImage;
					$scope.currentIdNumber = currentIdNumber;
					$scope.currentShowtime = currentShowtime;
					$scope.currentStatus = currentStatus;
					$scope.currentGender = currentGender;
		    });
		});


		$scope.idBanda = function(idAtual){
			myService.set(idAtual);
	  };

	};

}]);
