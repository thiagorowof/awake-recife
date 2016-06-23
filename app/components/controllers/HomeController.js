'use strict';

mostPopularListingsApp.controller('HomeController', ['$scope', '$timeout', function($scope, $timeout) {

	init();

	var score = 10;
	//
	// var slider = new Slider('#ex1', {
	// 	formatter: function(value) {
	// 		return 'Current value: ' + value;
	// 	}
	// });


	console.log("user atual:" + firebase.auth().currentUser);
	console.log("user: " + firebase.User);

	function init(){
		
		$('.slider').slider()

		var userId = firebase.auth().currentUser.uid;

		firebase.database().ref('grupos').on('value', function(snapshot) {

			var grupos = [],
  		currentGrupo = 0,
			currentVotes = "",
			currentDado1 = 0,
			currentDado2 = 0,
			currentDado3 = 0,
  		currentDescricao = "";

			snapshot.forEach(function(data) {
					grupos.push({"gruponome": data.key, "descricao": data.val().descricao, "dado1": data.val().dado1, "dado2": data.val().dado2,"dado3": data.val().dado3, "voteStatus": data.val().voteStatus});
					if(data.val().voteStatus === "none"){
						currentGrupo = data.key,
						currentVotes = data.val().voteStatus,
						currentDado1 = data.val().dado1,
						currentDado2 = data.val().dado2,
						currentDado3 = data.val().dado3,
	    			currentDescricao = data.val().descricao;
						console.log("if currentgrupo:");
						console.log(currentGrupo+currentVotes+currentDescricao);

					}
					console.log("push grupos:");
					console.log(grupos);
			});

			$timeout(function() {
				    $scope.grupos = grupos;
				    $scope.currentGrupo = currentGrupo;
						$scope.currentDescricao = currentDescricao;
						$scope.currentVotes = currentVotes;
						$scope.currentDado1 = currentDado1;
						$scope.currentDado2 = currentDado2;
						$scope.currentDado3 = currentDado3;

						console.log("timeoutgrupos:");
						console.log(grupos);


			});
		});










	};
}]);
