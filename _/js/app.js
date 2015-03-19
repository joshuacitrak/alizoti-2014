(function() {
	var app = angular.module('alizotiApp', [ 'ngRoute', 'ngAnimate' ]).config(
			router);

	function router($routeProvider) {
		$routeProvider.when('/', {
			templateUrl : 'partials/home.html'
		}).when('/home', {
			templateUrl : 'partials/home.html'
		}).when('/services/:servicesId/product/:productId/piece/:pieceId', {
			templateUrl : 'partials/services.html'
		}).when('/contact', {
			templateUrl : 'partials/contact.html'
		}).otherwise({
			redirectTo : '/'
		});
	}

	var dataObj = [];

	app.controller('PageController', function($scope, $rootScope, $http, $location, $routeParams) {
        //$scope.scState = "sm"; //default do we want to do this? until the data loads, this is irrelevant
		$http.get('_/js/data.json').success(
				function(data, status, headers, config) {
                    
					$scope.dataObj = data;
                    
                    $scope.slideshow = $scope.dataObj.slideshow;
                    
                    $scope.menu = $scope.dataObj.menu;
                    
                    $scope.services = $scope.dataObj.services;  //services[serviceId].product[productId]
                    
                    $scope.heroes = {};
                    $scope.lgThumbs = {};
                    $scope.smThumbs = {};
                    
                    //If you want to use URL attributes before the website is loaded
                    $rootScope.$on('$routeChangeSuccess', function () {
                        if($routeParams.servicesId)
                        {
                            $scope.servicesId = $routeParams.servicesId <= 2 ? $routeParams.servicesId : 2;
                            console.log($scope.servicesId  + " $scope.servicesId  ");
                            $scope.productId = $routeParams.productId;// <= Number($scope.services[$scope.servicesId].projects.length) ? $scope.productId : Number($scope.services[$scope.servicesId].projects.length);
                            //console.log($scope.services[$scope.servicesId].projects.length + " $scope.productId  " + ( $routeParams.productId <= $scope.services[$scope.servicesId].projects.length  ) + " -- " + $scope.productId );
                            $scope.pieceId = $routeParams.pieceId;
                            $scope.heroes = $scope.assembleImages();
                            $scope.currentHero = $scope.heroes[$scope.pieceId].hero;

                            $scope.$apply(function(){
                                $scope.heroes;
                            });
                        }
                    });
                    
                    $scope.assembleImages = function(){
                        var tmpArr = [];
                        for(var i = 0; i < $scope.services[$scope.servicesId].projects[$scope.productId].images.length; i++)
                        {
                            var sizeDir='';
                            if($scope.windowSize === 0)
                            {
                                sizeDir = 'sm/';
                            }
                            else if ($scope.windowSize === 1)
                            {
                                sizeDir = 'md/';
                            }
                            else{
                                sizeDir = 'lg/';
                            }
                            var heroesPath = $scope.services[$scope.servicesId].heroespath + sizeDir + $scope.services[$scope.servicesId].projects[$scope.productId].images[i];
                            var lgThumbPath = $scope.services[$scope.servicesId].lgThumbspath + sizeDir + $scope.services[$scope.servicesId].projects[$scope.productId].images[i];
                            var description = $scope.services[$scope.servicesId].projects[$scope.productId].descriptions[$scope.pieceId].description; 
                            
                           tmpArr.push({
                              hero: heroesPath,
                               lgThumb: lgThumbPath,
                               desc : description,
                               index: i});
                        }
                        return tmpArr
                    };//assemble imagages
                    
                    $scope.goTo = function(url){
                        $location.path(url);
                    };//goto

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
                    
                    $scope.windowSize = 0;
                    $scope.jqUpdateSize = function(){
                    var width = $(window).width();
                        if( width < 767)
                        {
                            $scope.windowSize = 0;
                        }
                        else if(width <= 768 || width < 992)
                        {
                            $scope.windowSize=1;
                        }
                        else
                        {
                            $scope.windowSize = 2;
                        }
                        $scope.$apply(function() {
                            $scope.windowSize }); //apply the update
                    };//getjqsize
                                        
                   $(document).ready($scope.jqUpdateSize);//call it once the data is loaded
                    $(window).resize($scope.jqUpdateSize);//then update approriately 
                    
				}).error(function(data, status, headers, config) {
			alert('data could not be loaded. epic fail.');
		});//error
	});

	app.controller('NavController', function($scope, $location) {
		this.isActive = function(viewLocation)
		{
            var arrStr = $location.path().split("/");//only needs to check the top level
			return viewLocation === arrStr[1]+"/"+arrStr[2] ;		
		};
	});
    
    var formData = {};
    
    app.controller('FormController', function($scope, $http){
        var returnMessage='hello';
        
        this.processForm = function(formData)
        {
            $http({
                method  : 'POST',
                url     : 'php/gmail.php',
                data    : $.param($scope.formData),  //param method from jQuery
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  //set the headers so angular passing info as form data (not request payload)
            })
            .success(function(data, status, headers, config) {
                console.log(data);
                if(data.success){
                     // this callback will be called asynchronously
                    // when the response is available
                    $scope.returnMessage = "Thanks for contacting us. We'll get back to you real soon!";
                }
                else{
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    $scope.returnMessage = "The email failed to send, try again later."; 
                }
              })
             .error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.returnMessage = "The email failed to send, try again later."; 
            });            
            //reset form
           $scope.formData = {};
            $scope.myForm.$setPristine();
            $scope.myForm.$setUntouched();
        };//process form
    });
})();