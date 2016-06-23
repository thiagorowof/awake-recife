'use strict';

mostPopularListingsApp.controller('WelcomeController', ['$scope', '$state', 'myService','$timeout', function($scope, $state, myService, $timeout) {

	init();
	function init(){
	};


	$scope.login = function(){
		//processando ...
		var email = $("#email").val();;
		var password = $("#password").val();;

		firebase.auth().signInWithEmailAndPassword('thiago.de.a.dantas@accenture.com', '123456').then(function() {
				//get the user
				var user = firebase.auth().currentUser;
				if(user) {
					$state.go('home')
						console.log('user logged in');
				} else {
						console.log('user not logged in');
				}
		}).catch(function(error) {
				var errorCode = error.code;
	  		var errorMessage = error.message;
				console.log("errorcode:" + errorCode);
				console.log("errorMessage:" + errorMessage);
				alert('Login sem sucesso');
		});


	}



}]);
