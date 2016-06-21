'use strict';

// angular.module('mostPopularListingsApp.banda', ['ngRoute'])
//
// // Routing configuration for this module
// .config(['$routeProvider',function($routeprovider, $locationProvider, myService){
// 	$routeprovider.when('/banda', {
// 		controller: 'BandaController',
// 		templateUrl: 'components/views/bandaView.html'
// 	});
// }])

// Controller definition for this module
mostPopularListingsApp.controller('BandaController', ['$scope', 'myService', '$timeout', '$stateParams', function($scope, myService, $timeout, $stateParams) {

	$scope.$stateParams = $stateParams;

	init();

	$scope.desiredLocation = myService.get();
	var publico;



	var slider = new Slider('#ex1', {
		formatter: function(value) {
			return 'Current value: ' + value;
		}
	});

	$scope.doTheBack = function() {
		window.history.back();
	};

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
						currentDescription = "",
						currentIntegrantes = [],
						currentCrowdMov = 0;

			snapshot.forEach(function(data) {
				bands.push({"name": data.key, "description": data.val().description, "image": data.val().image, "integrantes": data.val().integrantes, "bandname": data.val().bandname, "idNumber": data.val().idNumber, "gender": data.val().gender, "showtime": data.val().showtime, "score": data.val().score, "status": data.val().status});
				if(data.val().status === "presenting"){
					currentBandScore = data.val().score,
					currentName = data.key,
					currentBandName = data.val().bandname,
					currentIntegrantes = data.val().integrantes,
					currentImage = data.val().image,
					currentIdNumber = data.val().idNumber,
					currentGender = data.val().gender,
					currentDescription = data.val().description,
					currentShowtime = data.val().showtime,
    			currentCrowdMov = data.val().crowdMov;
					publico = currentCrowdMov;

				}
			});
			$timeout(function() {
					$scope.bands = bands;
			})


		});

	};

	$scope.teste = function(){
		//processando ...
		var target = angular.element('#ex1');
		var score = parseInt(target.val()) + parseInt(publico);
		var banda = $scope.bands[$stateParams.bandaname].name;

		var cb = function(err){
			//console.log(err);
			if(err){
				$('.resposta.error').show();
				setTimeout(function() {
					$('.resposta.error').fadeOut(400);
				}, 3000);
			}else{
				$('.resposta.sucesso').show();
				setTimeout(function() {
					$('.resposta.sucesso').fadeOut(400);
				}, 3000);
			}
		}
		firebase.database().ref('bands').child(banda).child('scores').push({"score": score}, cb);
	}

}]);
