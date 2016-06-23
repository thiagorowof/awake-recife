'use strict';

var mostPopularListingsApp = angular.module('mostPopularListingsApp',['ui.router']);
// var body = document.getElementsByTagName('body')[0];

// setTimeout(function() {
// 	$('.splash').fadeOut(400);
// }, 1000);

setTimeout(function() {
	var fade = { opacity: 0, transition: 'opacity 5s' };
  $('.splash').css(fade).slideUp(900);
}, 2000);

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
			templateUrl: "components/views/welcomeView.html",
			controller  : "WelcomeController"
		})
    .state('home', {
      url: "/home",
      templateUrl: "components/views/homeView.html",
			controller  : "HomeController"
    })
		.state('grupo', {
      url: "/grupo/:gruponome",
      templateUrl: "components/views/grupoView.html",
			controller  : "GrupoController"
    });
});
