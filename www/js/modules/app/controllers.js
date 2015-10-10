angular.module('app.controllers', ['course.service'])
  .controller('AppCtrl', AppCtrl);

function AppCtrl($rootScope, $scope, $state, courseService) {
  var displayAttendanceList = function() {
    courseService
      .getAttendanceListByDate()
      .then(function(attendanceListByDate) {
        $scope.attendanceListByDate = attendanceListByDate;
      }, function(err) {
        console.error(err);
      });
  };

  displayAttendanceList();

  $scope.$on('courses:updated', function() {
    displayAttendanceList();
  });

  $scope.didAttend = function(courseId, date) {
    courseService
      .didAttend(courseId, date)
      .then(function(result) {
        displayAttendanceList();
          displayAttendanceList();
          $rootScope.$broadcast('attendance:updated');
          $state.go('app.courses_main');
      }, function(err) {
        console.error(err);
      });
  };

  $scope.didNotAttend = function(courseId, date) {
    courseService
      .didNotAttend(courseId, date)
      .then(function(result) {
        displayAttendanceList();
        $rootScope.$broadcast('attendance:updated');
        $state.go('app.courses_main');
      }, function(err) {
        console.error(err);
      });
  };
}
