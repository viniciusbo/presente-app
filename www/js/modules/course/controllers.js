'use strict';

angular.module('course.controllers', ['course.service'])
  .controller('CoursesMainCtrl', CoursesMainCtrl)
  .controller('CoursesNewCtrl', CoursesNewCtrl)
  .controller('CoursesShowCtrl', CoursesShowCtrl);

function CoursesMainCtrl($rootScope, $scope, $state, $ionicSideMenuDelegate, $ionicPopup, courseService) {
  var displayCourses = function() {
    courseService
      .getAll()
      .then(function(courses) {
        $scope.courses = courses;
      }, function(err) {
        console.error(err);
      });
  };

  displayCourses();

  $scope.$on('attendance:updated', displayCourses);
  $scope.$on('courses:updated', displayCourses);

  $scope.getCourseClassesCountUntilNow = function(course) {
    return courseService.getCourseClassesCountUntilNow(course);
  };

  $scope.remove = function(course) {
    $ionicPopup
      .confirm({
        title: 'Remover matéria',
        template: 'Tem certeza que deseja remover esta matéria e todo seu histórico de presença?'
      })
      .then(function(res) {
        if (res == true) {
          courseService
            .remove(course)
            .then(function(result) {
              $rootScope.$broadcast('courses:updated');
              displayCourses();
            }, function(err) {
              console.error(err);
            });
        }
      });
  };
}

function CoursesNewCtrl($rootScope, $scope, $state, $ionicScrollDelegate, $cordovaLocalNotification, $cordovaKeyboard, courseService) {
  $scope.course = {
    classes: []
  };
  $scope.weekdays = [];
  $scope.defaultStartPlaceholder = moment().format('DD/MM/YYYY');

  $scope.hideKeyboard = function() {
    $cordovaKeyboard.close();
  };

  $scope.hasAtLeastOneClass = function(weekdays, courseClasses) {
    var classes = courseClasses || {};
    var isValid = false;

    if (weekdays && Array.isArray(weekdays)) {
      weekdays
        .forEach(function(weekday, index) {
          if (weekday == true && classes[index] > 0) {
            isValid = true;
          }
        });
    }

    return isValid;
  };

  $scope.save = function(course, weekdays) {
    window.plugin.notification.local.hasPermission(function(granted) {
      if (granted == false)
        window.plugin.notification.local.registerPermission(function(granted) {
          insertCourse();
        });
      else
        insertCourse();
    });

    function insertCourse() {
      courseService
        .insert(course, weekdays)
        .then(function(result) {
          $rootScope.$broadcast('courses:updated')
          $scope.closeNewClassModal();
        }, function(err) {
          console.error(err);
        });
    }
  };

  $scope.resizeScroll = function() {
    $ionicScrollDelegate.resize();
  };
}

function CoursesShowCtrl($scope, $stateParams, courseService) {
  courseService
    .get($stateParams.courseId)
    .then(function(result) {
      $scope.course = result;
    }, function(err) {
      console.error(err);
    })
}
