'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
angular.module('PresenteApp', ['ionic', 'config', 'PresenteApp.Intro.controller', 'PresenteApp.Course.controller'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('intro', {
      url: '/intro',
      templateUrl: 'scripts/modules/intro/templates/main.html',
      controller: 'IntroCtrl'
    })
    .state('main', {
      url: '/',
      templateUrl: 'scripts/modules/course/templates/main.html',
      controller: 'CoursesMainCtrl'
    })
    .state('courses_new', {
      url: '/new',
      templateUrl: 'scripts/modules/course/templates/new.html',
      controller: 'CoursesNewCtrl'
    })
    .state('courses_show', {
      url: '/show/{courseId}',
      templateUrl: 'scripts/modules/course/templates/show.html',
      controller: 'CoursesShowCtrl'
    });

  $urlRouterProvider.otherwise('/');
});
