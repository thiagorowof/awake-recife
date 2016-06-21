// HomeController.js
// For distribution, all controllers
// are concatanated into single app.js file
// by using Gulp

'use strict';

angular.module('mostPopularListingsApp.home', ['ngRoute'])

// Routing configuration for this module
.config(['$routeProvider',function($routeprovider){
	$routeprovider.when('/', {
		controller: 'HomeController',
		templateUrl: 'components/views/homeView.html'
	});
}])

// Controller definition for this module
.controller('HomeController', function($scope, $timeout) {
	

	//$timeout($scope.progressbar.complete(), 1000);
	var currentBandScore = 0,
		currentBandName = "",
		currentCrowdMov = 0;
		
	// Just a housekeeping.
	// In the init method we are declaring all the
	// neccesarry settings and assignments to be run once
	// controller is invoked
	init();
	//$scope.progressVal = 50;
	function init(){
        var config = {
		    apiKey: "AIzaSyDTZcYOrwZHAnqSmXx6bOa68jivC7C7U_I",
		    authDomain: "project-8616263356669679321.firebaseapp.com",
		    databaseURL: "https://project-8616263356669679321.firebaseio.com",
		    storageBucket: "",
            serviceAccount: {
                projectId: "project-8616263356669679321",
                clientEmail: "sarau-260@project-8616263356669679321.iam.gserviceaccount.com",
                privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCq9EN8w0iuWlqE\nSndT2mm55DYo8S5SjAw5FUwvApgym/q896MhAenU16awajC2HS5D9pb6HlgH25Y4\nOwCoGA/Fs74ZZEx/w1HODZnhGw63VkoH0DM3mvFx07Hbo0qJ2nTvgNfcMknDLerT\nDc6d7a1HCC46DTzDFeMojUywoLl+8zLCg7LJYqQILh/rIFfX48u+TLENjx63FUga\nrd/7yZTmSv2VzZ8sp01qEIpMcKZnwO3GHDdRSdn5dUmU/C72+6eaVdEXwkxpYapj\nSZA9IABdxiJMusTuTsmyD7/yXabeRMq//IIa4s2/PSJ5tAgKsiNLyOx8DYrWhKeJ\nfQZcf2vTAgMBAAECggEAGyA9ISvfeYLuv/UM8CpFAnEawu5aGlEMk3Y0q3Tu74De\njWOB5/fkwZgiY/XFmvAQakpTdIaiE0UdlfiOxx1iS02VCXRnyxIUBe0UkKp5cE/p\n2UmJBva3/wbHPwGvDyaxzVsVZWQ5XhYIH8seEOMozo+WvjFhhdcQP1wEYjZumJz8\nrA3x7w07CdJ6GFwRVOnGaz7f5o4cVVQ+1EdGkCEUhr3Rxx0ZLH8sx72YHlyAsBA1\n02UkFk62qzBQ3JopwB1RIAoeOLjfLhS6EjvpYc2J6CmX7L9FuAEyyheAuk0jKtxY\nkMLaOHlxQ5sVQpYc1d/LiLbe1zw+66yYlDA9QdsDCQKBgQD+/n1RcukEqPqrK44X\nKuMo0sW2S5XmfAoF+gM95871YOA3rIHemX80xY4/famtlNKJ2r17U0N7jsMxh3fq\nqDPZyBZQGmp/WsQEHnW5lf85hvkcVfAUiWxP0teRfDjd9V6nLIuoF6H0uBpnCh+Y\ntNo+6by5wlEZdPlPLX4qgJuoVQKBgQCroOeiCIf/QbiKqYKBP6XWhLESgNWsox0T\n4fAbuqAWZ5iycLihJd6t5vFrkzYrTQ/4vlIFC/ajfyD4l+R23aK5SANuHJrvnx/T\nDKzBRF0Snq9IbG9lGy5grkv6hdpnLWXFgkWfj+cfXA7xW1wGdsp9cZJNT2KiLOYa\nxWN8N3YLhwKBgQDtWGG7E1NTdBnGg4cBh3jjQbSoJpjDbUdDIuArmf3oJiDtkVNc\np9FghFYQQN5T5IdHq2PdS7YvZsXG70ouEBwbJQOn0b65BfoXv2ZitPxYRorO1ire\nYr9/WUgvccnYx5Av2OWxMzYbe9WPfTvFvui50IRK/1TPdjKsgTLDSuwX9QKBgEX3\ncZaHvdFcnHvCwNYp+VRrgbhWV0VqtabuW7EiMrMPhptwAoSHaLEiTdcaC2I5p0Iz\nbEJsbx6V6/4MBfJDRlwcNHHGLY90IkgqiZ68XOkDUdfHhN4F57E4PPcjbDbVtgB/\nrBxxULpjECBqqyhjcwcSrp7ftwkAHspZH8Z64Z+vAoGBAN1YcBcZrD/R7cuL6lPu\nnCQgXOKv7tUyGUHHfDPUGmhLr+yAzNny14lKslPeeBVge9MlDYRIAPZMKzgR0u2M\nwTclWeYTDCArI3HcOfJbL+k4hhP6MLFd38aOEsN8NM89TxEIbngJQ7VqhafBjdkK\nn3s+HyYDWYV8eHubdI/X6SDk\n-----END PRIVATE KEY-----\n"
            }
        };

        $("#hp_text").cooltext({
		   cycle:true,
		   sequence:[
		   	  {action:"update", text:"Let's Play Hard!!", css:{fontSize: "80px", color:"white", textShadow:"-3px -3px 0 #2D292B, 3px -3px 0 #2D292B, -3px 3px 0 #2D292B, 3px 3px 0 #2D292B"}},
		      {action:"animation", animation:"cool123"},
		      {action:"animation", animation:"cool233", delay:2},

		      {action:"update", text:""},
		      {action:"animation", animation:"cool01", stop: true},

		      {action:"update", text:"Awesome!!", css:{fontSize: "80px", color:"white", textShadow:"-3px -3px 0 #2D292B, 3px -3px 0 #2D292B, -3px 3px 0 #2D292B, 3px 3px 0 #2D292B"}},
		      {action:"animation", animation:"cool11"},
		      {action:"animation", animation:"cool207", delay:2},

		      {action:"update", text:""},
		      {action:"animation", animation:"cool01", stop: true},

		      {action:"update", text:"Fantastic!!", css:{fontSize: "80px", color:"white", textShadow:"-3px -3px 0 #2D292B, 3px -3px 0 #2D292B, -3px 3px 0 #2D292B, 3px 3px 0 #2D292B"}},
		      {action:"animation", animation:"cool64"},
		      {action:"animation", animation:"cool298", delay:2},

		      {action:"update", text:""},
		      {action:"animation", animation:"cool01", stop: true},

		      {action:"update", text:"Perfect!!", css:{fontSize: "80px", color:"white", textShadow:"-3px -3px 0 #2D292B, 3px -3px 0 #2D292B, -3px 3px 0 #2D292B, 3px 3px 0 #2D292B"}},
		      {action:"animation", animation:"cool58"},
		      {action:"animation", animation:"cool294", delay:2},

		      {action:"update", text:""},
		      {action:"animation", animation:"cool01", stop: true},

		      {action:"update", text:"WoooooooooooW!!", css:{fontSize: "80px", color:"white", textShadow:"-3px -3px 0 #2D292B, 3px -3px 0 #2D292B, -3px 3px 0 #2D292B, 3px 3px 0 #2D292B"}},
		      {action:"animation", animation:"cool48"},
		      {action:"animation", animation:"cool289", delay:2},

		      {action:"update", text:""},
		      {action:"animation", animation:"cool01", stop: true}
		   ]
		});

		function switchPosition(selector1, selector2){

			/*var p1 = $("#elm-3").position().top;
			var p2 = $("#elm-6").position().top;
			
			for(var i = 3; i < 7 ; i++){
				if(i != 3){
					var p = $("#elm-"+i).position().top;
					//$("#elm-"+i).transition({ y: (p2 > p1 ? p2-p1 : p1-p2) + 'px' });
					//$("#elm-"+i).transition({ y: (p > p1 ? p1-p : p-p1) + 'px' });
				}
			}
			$("#elm-3").transition({ y: (p2 > p1 ? p2-p1 : p1-p2) + 'px' });*/

			var p1 = $("#elm-"+selector1).position().top;
			var p2 = $("#elm-"+selector2).position().top;

			console.log($("#elm-"+selector1).position().top);
			console.log($("#elm-"+selector2).position().top);

			var delta = 0;

			if(p1 > p2){
				delta = -(p1 - p2);
				$("#elm-"+selector1).transition({ y: delta + 'px' });
			}else if(p1 < p2){
				delta = p2 - p1;
				$("#elm-"+selector1).transition({ y: delta + 'px' });
			}
			
			//$("#elm-"+selector2).transition({ y: (p2 > p1 ? p1-p2 : -(p1-p2)) + 'px' });
			console.log("value " + delta);

			var rankPos1 = $('#elm-'+ selector1 + ' span:first').html();
			var rankPos2 = $('#elm-' + selector2 + ' span:first').html();

			$('#elm-'+ selector1 + ' span:first').html(rankPos1);
			$('#elm-' + selector2 + ' span:first').html(rankPos2);

			//console.log($('#elm-6 span').html());
			//console.log($('#elm-3 span').html());
		}

		function switchPosition2(selector1, delta){

			console.log("delta " + delta);
			$("#elm-"+selector1).transition({ y: delta + 'px' });
		}

        firebase.initializeApp(config);	
        //$("#bandRanking").transition({ x: '200px' });		
        $("#hp_text").cooltext("play");
        
        firebase.database().ref('bands').on('value', function(snapshot) {
        	var bands = [],	
        		presenting = false;
        		
			snapshot.forEach(function(data) {
				var totalScore = 0;

				if(data.val().scores) {
					console.log(data.val().scores);
					for (var key in data.val().scores) {
						if (!data.val().scores.hasOwnProperty(key)) continue;
						var obj = data.val().scores[key];
						totalScore += obj.score;
					}
				}

				bands.push({"name": data.val().bandname, "score": totalScore, "scoreLabel": totalScore.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."), "status": data.val().status, "image": data.val().image});

				if(data.val().status === "presenting"){					
    				currentBandName = data.val().bandname;

					if(totalScore > currentBandScore){
						currentBandScore = totalScore;

	        			if (totalScore > 1000){
							$("#hp_text").cooltext("goto", {where:'next'});
	        			}	        			
	        			 				
	        			Fireworks.createParticle(); 	        			
        			}

        			presenting = true;
					currentCrowdMov = data.val().crowdMov;   			   			
				}


			});
			
			$scope.$apply(function() {

				if(presenting){
					$("#bandRanking").transition({ x: '0px' });			
					$("#container").transition({ opacity: 0 });
					$("#rank-header").show();
					$("#rank-footer").show();
				}else{
					$("#container").transition({ opacity: 1 });
					$("#bandRanking").transition({ x: '340px' });
					currentBandScore = 0,
					currentBandName = "",
					currentCrowdMov = 0;
				}


				/*var winner = 4;
				var loser = 2;
				$timeout(function() {
			        switchPosition(winner, loser);
		        	for(var i = 1; i < 7 ; i++){
						if(i != winner && i >=loser){
							switchPosition2(i, $( "#elm-" + loser ).height());	
						} else if(i < loser+1){
							switchPosition2(i, -$( "#elm-" + loser ).height());	
						}
					}
			    }, 3000);*/

				
			    $scope.bands = bands;
			    $scope.currentBandScore = currentBandScore.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
			    $scope.currentBandName = currentBandName; 
			    $('#hand-bar').transition({ y: -290*(currentCrowdMov/100) + 'px' });
			    //$scope.progressData = { "loaded": currentCrowdMov, "total": 100*(screen.width/screen.height) };
		    });			
		});

        //push votes
        /*firebase.database().ref('bands/banda1/score').push({
			value: 30
		});
        firebase.database().ref('bands/banda1/score').push({
			value: 50
		});
        firebase.database().ref('bands/banda1/score').push({
			value: 100
		});
        firebase.database().ref('bands/banda1/score').push({
			value: 200
		});*/
		//push some data
		/*var postId = "banda1";
		firebase.database().ref('bands/' + postId).set({
			score: 30,
			status: "presenting",
			crowdMov: 0
		});
		postId = "banda2";
		firebase.database().ref('bands/' + postId).set({
			score: 130,
			status: "presenting",
			crowdMov: 0
		});
		postId = "banda3";
		firebase.database().ref('bands/' + postId).set({
			score: 320,
			status: "presenting",
			crowdMov: 0
		});
		postId = "banda4";
		firebase.database().ref('bands/' + postId).set({
			score: 330,
			status: "presenting",
			crowdMov: 0
		});*/
	};

	this.message = "Hello Home!";

});