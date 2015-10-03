'use strict';

angular.module('PresenteApp.Course.controller', ['PresenteApp.Course.service'])
  .controller('CoursesMainCtrl', CoursesMainCtrl)
  .controller('CoursesNewCtrl', CoursesNewCtrl)
  .controller('CoursesShowCtrl', CoursesShowCtrl);

function CoursesMainCtrl($scope, courseService) {
  console.log('CoursesMainCtrl');

  courseService
    .getAll()
    .then(function(courses) {
      console.log(courses);
      $scope.courses = courses;
    });
}

function CoursesNewCtrl($scope, $location, courseService) {
  console.log('CoursesNewCtrl');

  $scope.save = function() {
    courseService
      .insert($scope.course)
      .then(function(result) {
        $location.go('main');
      }, function(err) {
        console.log(err);
      });
  }
}

function CoursesShowCtrl($scope, courseService) {
  console.log('CoursesShowCtrl');
}
