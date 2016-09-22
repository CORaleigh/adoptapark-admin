'use strict';

/**
 * @ngdoc overview
 * @name adoptaparkAdminApp
 * @description
 * # adoptaparkAdminApp
 *
 * Main module of the application.
 */
angular
  .module('adoptaparkAdminApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'angular-loading-bar'  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
.factory('parkData', function ($http, $q) {
  var service = {},
    baseUrl = 'http://openmaps.raleighnc.gov/parksapi/v1/ws_geo_attributequery.php',
    adminUrl = 'http://openmaps.raleighnc.gov/parksapi/v1/ws_parks_admin.php',
    addUrl = 'http://openmaps.raleighnc.gov/parksapi/v1/ws_parks_adopt.php',
    setFullUrl = 'http://openmaps.raleighnc.gov/parksapi/v1/ws_parks_set_full.php';

  service.getParkData = function (table, fields, order) {
    var deferred = $q.defer();
    $http({
      url: baseUrl,
      params: {
        table: table,
        fields: fields,
        order: order
      }
    }).success(function (data) {
      deferred.resolve(data);
    });
    return deferred.promise;
  }

  service.deleteAdopter = function (id) {
    var deferred = $q.defer();
    $http({
      url: adminUrl,
      params: {
        id: id,
        action: 'delete'
      }
    }).success(function (data) {
      deferred.resolve(data);
    });
    return deferred.promise;    
  }
  service.updateAdopter = function (adopter) {
    var deferred = $q.defer();
    console.log(adopter);
    $http({
      url: adminUrl,
      method: 'POST',
      params: {
        id: adopter.id,
        action: 'update',
        contact: adopter.contact,
        organization: adopter.display,
        email: adopter.email,
        start: adopter.start,
        expires: adopter.expires,
        phone: adopter.phone
      }
    }).success(function (data) {
      deferred.resolve(data);
    });
    return deferred.promise;    
  }  
  service.addAdopter = function (adopter, parkid) {
    var deferred = $q.defer();
    $http({
      url: addUrl,
      method: 'POST',
      params: {
        id: parkid,
        contact: adopter.contact,
        organization: adopter.display,
        email: adopter.email,
        start: adopter.start,
        expires: adopter.expires,
        phone: adopter.phone
      }
    }).success(function (data) {
      deferred.resolve(data);
    });
    return deferred.promise;    
  }    
  service.updateFull = function (full, parkid) {
    var deferred = $q.defer();
    $http({
      url: adminUrl,
      method: 'POST',
      params: {
        full: full,
        id: parkid,
        action: 'setfull'
      }
    }).success(function (data) {
      deferred.resolve(data);
    });
    return deferred.promise;    
  }   
  return service;
});
