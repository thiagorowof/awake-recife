'use strict';

var mostPopularListingsApp = angular.module('mostPopularListingsApp',['ui.router']);
// var body = document.getElementsByTagName('body')[0];

setTimeout(function() {
	$('.splash').fadeOut(400);
}, 4000);

window.addEventListener("orientationchange", function() {
	setTimeout(function() {
		if(window.innerWidth > window.innerHeight){
		    $('.blocker').show();
				$('html,body').css('overflow', 'hidden');
		}else{
				$('.blocker').hide();
				$('html,body').attr('style', '');
		}
	}, 300);
}, false);

mostPopularListingsApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

// $locationProvider.html5Mode(true)

	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('welcome', {
			url: "/",
			templateUrl: "components/views/welcomeView.html"
		})
    .state('home', {
      url: "/home",
      templateUrl: "components/views/homeView.html",
			controller  : "HomeController"
    })
		.state('banda', {
      url: "/banda/:bandaname",
      templateUrl: "components/views/bandaView.html",
			controller  : "BandaController"
    });
});
