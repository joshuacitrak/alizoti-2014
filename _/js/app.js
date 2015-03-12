(function() {
	var app = angular.module('alizotiApp', [ 'ngRoute', 'ngAnimate' ]).config(
			router);
    
    var scState = "sm"; //for dynamically switching ng-src based on screen size

	function router($routeProvider) {
		$routeProvider.when('/', {
			templateUrl : 'partials/home.html'
		}).when('/home', {
			templateUrl : 'partials/home.html'
		}).when('/services/:servicesId/product/:productId', {
			templateUrl : 'partials/services.html'
		}).when('/contact', {
			templateUrl : 'partials/contact.html'
		}).otherwise({
			redirectTo : '/'
		});
	}

	var dataObj = [];

	app.controller('PageController', function($scope, $http, $location) {
		$http.get('_/js/data.json').success(
				function(data, status, headers, config) {
					$scope.dataObj = data;
                    
                    $scope.goTo = function(url){
                        $location.path(url);
                        //console.log($scope.dataObj.menu[0] + " goto");
                    }

                    $scope.getProductId = function(){
                        //return productId
                        //console.log($scope.dataObj.slideshow[0].type + " getProduct id");
                    }

                    $scope.next = function(){
                        //check the current productId against the length
                        //
                       // console.log("next " + $scope.dataObj.services[2].projects[0].images[0]);
                    }

                    $scope.previous = function(){
                        //check the current productId agaist the length
                        //--
                        //console.log("previous " + $scope.dataObj.services[0].projects[2].descriptions[3].description);
                    }
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
    
    function jqUpdateSize(){
    // Get the dimensions of the viewport
    var width = $(window).width();
        
        if( width < 767)
        {
            scState = "sm"
        }
        else if(width <= 768 || width < 992)
        {
            scState ="md";
        }
        else
        {
            scState = "lg";
        }
        
    };
$(document).ready(jqUpdateSize);    // When the page first loads
$(window).resize(jqUpdateSize); 
})();