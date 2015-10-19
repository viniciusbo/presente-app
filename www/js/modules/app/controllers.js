angular.module('app.controllers', ['course.service'])
  .controller('AppCtrl', AppCtrl);

function AppCtrl($rootScope, $scope, $state, $ionicModal, $q, courseService) {
  var displayAttendanceList = function() {
    courseService
      .getAttendanceListByDate()
      .then(function(attendanceListByDate) {
        $scope.attendanceListByDate = attendanceListByDate;

        var pendingAttendanceCount = 0;

        for(var date in attendanceListByDate) {
          attendanceListByDate[date].forEach(function(attendance) {
            console.log(attendance);
          });
        };
      }, function(err) {
        console.error(err);
      });
  };

  $scope.pendingAttendanceCount = 0;

  displayAttendanceList();

  $scope.$on('courses:updated', function() {
    displayAttendanceList();
  });

  var initModal = function() {
    if ($scope.modal) {
      return $q.when();
    } else {
      return $ionicModal
        .fromTemplateUrl('js/modules/course/templates/new-dialog.html', {
          scope: $scope,
          animation: 'slide-in-up'
        })
        .then(function(modal) {
          $scope.modal = modal;
        });
    }
  };

  $scope.openNewClassModal = function() {
    initModal()
      .then(function() {
        $scope.modal.show();
      })
  };

  $scope.closeNewClassModal = function() {
    $scope
      .modal
      .remove()
      .then(function() {
        $scope.modal = null;
      });
  };

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
