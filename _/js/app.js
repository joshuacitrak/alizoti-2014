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
	}

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
    
    var formData = {};
    
    app.controller('FormController', function($scope, $http){
        var returnMessage='hello';
        this.processForm = function(formData)
        {
            //send to php script
            $http.post('/someUrl', {msg:$scope.formData}).
              success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.returnMessage = "Thanks for contacting us. We'll get back to you real soon!";
              }).
              error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.returnMessage = "The email failed to send, try again later."; 
                console.log($scope.returnMessage);
              });
            
            //reset form
           $scope.formData = {};
            $scope.myForm.$setPristine();
            $scope.myForm.$setUntouched();
        };//process form
    });
})();