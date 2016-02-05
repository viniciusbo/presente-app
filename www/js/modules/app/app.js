// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'ngCordova', 'app.controllers', 'course.controllers'])

.run(function($ionicPlatform, $cordovaLocalNotification) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    moment.locale('pt-br');
    $cordovaLocalNotification.cancelAll();
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.views.swipeBackEnabled(false);

  $stateProvider

    .state('app', {
      url: '/app',
      abstract: true,
      cache: false,
      templateUrl: 'js/modules/app/templates/app.html',
      controller: 'AppCtrl'
    })

    .state('app.courses_main', {
      url: '/courses',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'js/modules/course/templates/main.html',
          controller: 'CoursesMainCtrl'
        }
      }
    })

    // .state('app.courses_new', {
    //   url: '/courses/new',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'js/modules/course/templates/new.html',
    //       controller: 'CoursesNewCtrl'
    //     }
    //   }
    // })

    .state('app.courses_show', {
      url: '/courses/{courseId}',
      views: {
        'menuContent': {
          templateUrl: 'js/modules/course/templates/show.html',
          controller: 'CoursesShowCtrl'
        }
      }
    });

  $urlRouterProvider.otherwise('/app/courses');
});
