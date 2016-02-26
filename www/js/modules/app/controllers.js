angular.module('app.controllers', ['course.service'])
  .controller('AppCtrl', AppCtrl);

function AppCtrl($rootScope, $scope, $state, $ionicModal, $ionicPopover, $q, courseService) {
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

  $scope.moment = moment;

  $scope.pendingAttendanceCount = 0;

  $scope.$on('courses:updated', function() {
    displayPendingAttendanceCount();
    displayAttendanceList();
  });

  $scope.openNewClassModal = function() {
    initModal()
      .then(function() {
        $scope.modal.show();
      })
  };

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

  $scope.closeNewClassModal = function() {
    $scope
      .modal
      .remove()
      .then(function() {
        $scope.modal = null;
      });
  };

  $scope.openAttendancePopover = function($event, attendance) {
    $scope.attendance = attendance;
    $scope.maxAttendanceCount = attendance.count;
    $scope.popover.show($event);
  };

  $scope.didAttend = function(attendance) {
    courseService
      .didAttend(attendance.courseId, attendance.date, attendance.count)
      .then(function(result) {
        displayAttendanceList();
        displayPendingAttendanceCount();
        $rootScope.$broadcast('attendance:updated');
        $state.go('app.courses_main');
      }, function(err) {
        console.error(err);
      });

      $scope.popover.hide();
  };

  $scope.didNotAttend = function(attendance) {
    courseService
      .didNotAttend(attendance.courseId, attendance.date)
      .then(function(result) {
        displayAttendanceList();
        displayPendingAttendanceCount();
        $rootScope.$broadcast('attendance:updated');
        $state.go('app.courses_main');
      }, function(err) {
        console.error(err);
      });
  };

  $ionicPopover
    .fromTemplateUrl('js/modules/course/templates/did-attend-popover.html', {
      scope: $scope
    })
    .then(function(popover) {
      $scope.popover = popover;
    });
}
