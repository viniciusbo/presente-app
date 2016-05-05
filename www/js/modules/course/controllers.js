'use strict';

angular.module('course.controllers', ['course.service'])
  .controller('CoursesMainCtrl', CoursesMainCtrl)
  .controller('CoursesNewCtrl', CoursesNewCtrl)
  .controller('CoursesShowCtrl', CoursesShowCtrl);

function CoursesMainCtrl($rootScope, $scope, $state, $ionicSideMenuDelegate, $ionicPopup, courseService) {
  displayCourses(courseService, $scope);

  $scope.$on('attendance:updated', displayCourses.bind(this, courseService, $scope));
  $scope.$on('courses:updated', displayCourses.bind(this, courseService, $scope));

  $scope.getCourseClassesCountUntilNow = function(course) {
    return courseService.getCourseClassesCountUntilNow(course);
  };

  $scope.remove = showRemoveDialog.bind(this, $ionicPopup, courseService, $rootScope);
}

function displayCourses(courseService, $scope) {
  courseService
    .getAll()
    .then(function(courses) {
      $scope.courses = courses;
    }, function(err) {
      console.error(err);
    });
}

function showRemoveDialog($ionicPopup, courseService, $rootScope, course) {
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
            displayCourses(courseService, $rootScope);
          }, function(err) {
            console.error(err);
          });
      }
    });
};

function CoursesNewCtrl($rootScope, $scope, $state, $ionicScrollDelegate, $cordovaLocalNotification, $cordovaKeyboard, courseService) {
  $scope.course = {
    classes: []
  };
  $scope.weekdays = [];
  $scope.defaultStartPlaceholder = moment().format('DD/MM/YYYY');

  $scope.hideKeyboard = function() {
    if ($cordovaKeyboard)
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
    if (window.plugin.notification) {
      window.plugin.notification.local.hasPermission(function(granted) {
        if (granted == false)
          window.plugin.notification.local.registerPermission(function(granted) {
            insertCourse();
          });
        else
          insertCourse();
      });
    }

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

function CoursesShowCtrl($rootScope, $scope, $stateParams, courseService, $ionicPopup, $ionicActionSheet, $state) {
  courseService
    .get($stateParams.courseId)
    .then(function(result) {
      $scope.course = result;
    }, function(err) {
      console.error(err);
    })

  $scope.remove = showRemoveDialog.bind(null, $ionicPopup, courseService, $rootScope);

  $scope.openCourseActionSheet = function(course) {
    var hideSheet = $ionicActionSheet.show({
      destructiveText: 'Remover matéria',
      destructiveButtonClicked: function() {
        courseService
          .remove(course._id)
          .then(function(result) {
            $rootScope.$broadcast('courses:updated');
            $state.go('app.courses_main');
          }, function(err) {
            console.error(err);
          });
      }
    });
  };
}
