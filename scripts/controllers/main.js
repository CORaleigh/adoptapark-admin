'use strict';

/**
 * @ngdoc function
 * @name adoptaparkAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the adoptaparkAdminApp
 */
angular.module('adoptaparkAdminApp')
  .controller('MainCtrl', function ($scope, $filter, parkData) {
    parkData.getParkData('parks.park_adopters', 'parkid,id,name,display,contact,email,phone,start,expires,parkfull', 'name').then(function (data) {
        $scope.parks = [];
        $scope.canExport = Modernizr.adownload;
    	var names = [];
    	var parks = [];
    	angular.forEach(data, function (d) {
    		if (names.indexOf(d.name) > -1) {
    			$scope.parks[names.indexOf(d.name)].adopters.push({
                    id: d.id,
    				display: d.display,
    				contact: d.contact,
    				email: d.email,
    				phone: d.phone,
    				start: d.start,
    				expires: d.expires
    			});
    		} else {
    			var park = {name: d.name, id: d.parkid, parkfull: d.parkfull, adopters: []};
    			if (d.email) {
    				park.adopters.push({
    					id: d.id,
	    				display: d.display,
	    				contact: d.contact,
	    				email: d.email,
	    				phone: d.phone,
	    				start: d.start,
	    				expires: d.expires
	    			});
    			}    		
    			parks.push(park);
    			$scope.parks = parks;

    			names.push(d.name);
    		}
    		
    	});

 		$scope.searchChanged = function () {
 			if ($scope.search.length === 0) {
 				$scope.parks = parks;
 			} else {
 				$scope.parks = $filter('filter')(parks, $scope.search);
 			}
 			
 		};

 		$scope.updateAdopter = function (adopter, parkid, action) {
            if (action === 'update') {
                parkData.updateAdopter(adopter).then(function (data) {
                    if (data.success) {
                        console.log(data.success);
                    }
                });                
            } else if (action === 'add') {
                parkData.addAdopter(adopter, parkid).then(function (data) {
                    if (data.success) {
                        console.log(data.success.id);
                        adopter.id = data.success.id;
                        adopter.expires = data.success.expires;
                    }
                });                
            }

 		};

 		$scope.deleteAdopter = function (id, parkid, index) {
            if (id) {
                parkData.deleteAdopter(id).then(function (data) {
                    if (data.success) {
                    }
                });                
            }


                var park = $filter('filter')(parks, function (park, i) {
                    return park.id === parkid;
                });
                if (park.length > 0) {
                    park = park[0];
                    park.adopters.splice(index, 1);
                }

 		};

        $scope.addAdopter = function (id) {

            var park = $filter('filter')($scope.parks, function (park, index) {
                return park.id === id;
            });
            console.log(park);
            if (park.length > 0) {
                park = park[0];
                park.adopters.push({
                    contact: '',
                    display: '',
                    email: '',
                    phone: '',
                    start: '',
                    expires: ''
                });
            }
        };

        $scope.parkFullToggled = function (park) {
            parkData.updateFull(park.parkfull, park.id).then(function () {

            });
        };

        $scope.exportList = function (e) {
            var park = null,
                adopter = null,
                data = [['Park', 'Organization', 'Contact', 'Email', 'Phone', 'Starts', 'Expires']],
                csvContent = "data:text/csv;charset=utf-8,Park,Organization,Contact,Email,Phone,Starts,Expires\n";
            for (var i = 0; i < $scope.parks.length; i++) {
                park = $scope.parks[i];
                if (park.adopters.length > 0) {
                    for (var j = 0; j < park.adopters.length; j++) {
                        adopter = park.adopters[j];
                        //data.push([park.name, adopter.display, adopter.contact, adopter.email, adopter.phone, adopter.start, adopter.expires]);
                        csvContent += park.name + ',' + adopter.display + ',' + adopter.contact + ',' + adopter.email + ',' + adopter.phone + ',' + adopter.start + ',' + adopter.expires + '\n';
                    }
                }
            }
            var encodedUri = encodeURI(csvContent);
            e.target.setAttribute('href', encodedUri);
            e.target.setAttribute('download', 'park_adoption_list.csv');
        };

        $scope.emailPattern = (function() {
            var regexp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return {
                test: function(value) {
                    if( $scope.requireTel === false ) {
                        return true;
                    }
                    return regexp.test(value);
                }
            };
        })(); 

        $scope.phoneNumberPattern = (function() {
            var regexp = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
            return {
                test: function(value) {
                    if( $scope.requireTel === false ) {
                        return true;
                    }
                    return regexp.test(value);
                }
            };
        })();   


         
    });
  });
