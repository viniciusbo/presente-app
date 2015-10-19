angular.module('app.controllers', ['course.service'])
  .controller('AppCtrl', AppCtrl);

function AppCtrl($rootScope, $scope, $state, $ionicModal, $q, courseService) {
  var displayAttendanceList = function() {
    courseService
      .getAttendanceListByDate()
      .then(function(attendanceListByDate) {
        $scope.attendanceListByDate = attendanceListByDate;
      }, function(err) {
        console.error(err);
      });
  };

  var displayPendingAttendanceCount = function() {
    courseService
      .getPendingAttendanceCount()
      .then(function(count) {
        $scope.pendingAttendanceCount = count;
      }, function(err) {
        console.error(err);
      });
  };

  displayAttendanceList();
  displayPendingAttendanceCount();

  $scope.pendingAttendanceCount = 0;

  $scope.$on('courses:updated', function() {
    displayPendingAttendanceCount();
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
          displayPendingAttendanceCount();
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
        displayPendingAttendanceCount();
        $rootScope.$broadcast('attendance:updated');
        $state.go('app.courses_main');
      }, function(err) {
        console.error(err);
      });
  };
}
