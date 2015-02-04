(function() {
	var app = angular.module('alizotiApp', [ 'ngRoute', 'ngAnimate' ]).config(
			router);

	function router($routeProvider) {
		$routeProvider.when('/', {
			templateUrl : 'partials/home.html'
		}).when('/home', {
			templateUrl : 'partials/home.html'
		}).when('/services/:servicesId', {
			templateUrl : 'partials/services.html'
		}).when('/contact', {
			templateUrl : 'partials/contact.html'
		}).otherwise({
			redirectTo : '/'
		});
	};

	var dataObj = [];

	app.controller('PageController', function($scope, $http) {
		$http.get('_/js/data.json').success(
				function(data, status, headers, config) {
					$scope.dataObj = data;
				}).error(function(data, status, headers, config) {
			alert('data could not be loaded.');
		});
	});

	app.controller('NavController', function($scope, $location) {
		this.isActive = function(viewLocation)
		{
			return viewLocation === $location.path();		
		};
	});
})();