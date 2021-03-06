(function() {
	var app = angular.module('alizotiApp', [ 'ngRoute', 'ngAnimate', 'ngTouch' ]).config(
			router);

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

	app.controller('PageController', function($scope, $rootScope, $http, $location, $routeParams, $window) {
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
                    
                    $scope.isDetails = false;
                    
                    //If you want to use URL attributes before the website is loaded
                    $rootScope.$on('$routeChangeSuccess', function () {
                        if($routeParams.servicesId)
                        {                       
                            $scope.servicesId = $routeParams.servicesId;
                            $scope.productId = $routeParams.productId;
                            if(!$scope.isDetails)
                                $scope.pieceId = 0;
                            $scope.isDetails = false;
                            $scope.setPage();
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
                            var description = $scope.services[$scope.servicesId].projects[$scope.productId].descriptions;//[$scope.pieceId].description; 
                            var detailsUrl = $scope.services[$scope.servicesId].projects[$scope.productId].details;
                            
                           tmpArr.push({
                              hero: heroesPath,
                               lgThumb: lgThumbPath,
                               detailsUrl:detailsUrl,
                               desc : description,
                               index: i});
                        }
                        return tmpArr
                    };//assemble imagages
                    
                    $scope.setPage = function(){
                            $scope.heroes = $scope.assembleImages();
                            $scope.currentHero = $scope.heroes[$scope.pieceId].hero;
                            $scope.smThumbs = $scope.getSmThumbs();     
                            $scope.$apply();
                    }//setPage
                    
                    $scope.getSmThumbs = function(){
                        var tmpArr = [];
                        for(var i = 0; i<$scope.services[$scope.servicesId].projects.length; i++)
                        {
                            if(i != $scope.productId)
                            {
                                var smThumbPath = $scope.services[$scope.servicesId].smThumbspath +  $scope.services[$scope.servicesId].projects[i].images[0];
                                var description = $scope.services[$scope.servicesId].projects[i].description;
                                tmpArr.push({thumb:smThumbPath,
                                                      desc:description,
                                                        index:i});
                            }
                        }
                        $scope.smThumbs = tmpArr;
                        return $scope.smThumbs;
                    };//smThumbs
                    
                    $scope.goTo = function(url){
                        $location.path(url);
                    };//goto
                    
                    $scope.detailsClick = function(){
                        $scope.isDetails = true;
                        $scope.currentHero = $scope.heroes[$scope.pieceId].hero;
                        $scope.pieceId = $scope.services[$scope.servicesId].projects[$scope.productId].details[2];
                        $scope.goTo('services/'+$scope.services[$scope.servicesId].projects[$scope.productId].details[0]+'/product/'+$scope.services[$scope.servicesId].projects[$scope.productId].details[1]);
                    };//detailsClick
                    
                    $scope.thumbClick = function(btn){
                        $scope.pieceId = btn;
                        $( ".main-fg" ).fadeOut( 370, function() {
                            // Animation complete
                            $scope.currentHero = $scope.heroes[$scope.pieceId].hero;
                            $scope.$apply();
                            $( ".main-fg" ).fadeIn(370, function() {
                            });
                          });
                        
                    };//thumb click
                    
                    $scope.getDetails = function(){
                        if($scope.servicesId == 2)
                            return true;
                        else
                            return false;
                    };//getDetails
                    
                    $scope.$watch('pieceId', function(newVal, oldVal)
                                  {
                        if(!newVal) newVal = 1;
                        else newVal++;
                        //add class to new value .thumb-fg-disabled
                        $(".thumb-list .thumb-list-item:nth-child(" + newVal +") figure").addClass("thumbfgdisabled"); 
                        $(".thumb-list .thumb-list-item:nth-child(" + newVal +") figure figcaption").addClass("thumbcaptiondisabled");
                        
                        //remove class from old
                        if(oldVal === undefined) oldVal = 1;
                        else oldVal++;
                        $(".thumb-list .thumb-list-item:nth-child(" + oldVal +") figure").removeClass("thumbfgdisabled"); 
                        $(".thumb-list .thumb-list-item:nth-child(" + oldVal +") figure figcaption").removeClass("thumbcaptiondisabled");
                    });//watch piece id

                    $scope.next = function(){
                        $( ".main-fg" ).fadeOut( 370, function() {
                            if($scope.pieceId === $scope.heroes.length-1)
                            {
                                $scope.pieceId = 0;
                            }
                            else
                            {
                                $scope.pieceId++;
                            }
                            $scope.currentHero = $scope.heroes[$scope.pieceId].hero;
                            $scope.$apply();
                            $( ".main-fg" ).fadeIn(370, function() {
                            });
                        });
                    }//next

                    $scope.previous = function(){
                        $( ".main-fg" ).fadeOut( 370, function() {
                            if($scope.pieceId <= 0)
                            {
                                $scope.pieceId = $scope.heroes.length-1;
                            }
                            else
                            {
                                $scope.pieceId--;
                            }
                            $scope.currentHero = $scope.heroes[$scope.pieceId].hero;
                            $scope.$apply();
                                $( ".main-fg" ).fadeIn(370, function() {
                                });
                        });
                    }//previous
                    
                    $scope.windowWidth = window.innerWidth;
                    $(window).on("resize.doResize", function (){
                    $scope.windowWidth = window.innerWidth;
                    $scope.$apply(function(){
                       
                    });
                });//listener
                    

                $scope.$on("$destroy",function (){
                     $(window).off("resize.doResize"); //remove the handler added earlier
                });//destroy
                    
                    $scope.$watch(function(){
                    return $window.innerWidth;
                    }, function(value) {
                        var oldVal = $scope.windowSize;
                    if( value < 767)
                        {
                            $scope.windowSize = 0;
                        }
                        else if(value <= 768 || value < 992)
                        {
                            $scope.windowSize=1;
                        }
                        else
                        {
                            $scope.windowSize = 2;
                        }
                        if (oldVal != $scope.windowSize && oldVal != undefined)
                            $scope.setPage();
                    });//watch
                    
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
            console.log($scope.formData.type + " form data ");
            $http({
                method  : 'POST',
                url     : 'php/mailer.php',
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