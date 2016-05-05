'use strict';

angular
  .module('course.service', [])
  .service('courseService', ['$q', '$cordovaLocalNotification', '$cordovaBadge', courseService]);

function courseService($q, $cordovaLocalNotification, $cordovaBadge, CourseModel) {
  var db = new PouchDB('courses', {
    adapter: 'localstorage'
  });

  this.getAll = function() {
    var deferred = $q.defer();
    var options = {
      include_docs: true
    };

    db.allDocs(options, function(err, result) {
      if (err) {
        deferred.reject(err);
        return;
      }

      deferred.resolve(result.rows);
    });

    return deferred.promise;
  };

  this.get = function(courseId) {
    var deferred = $q.defer();

    db.get(courseId, function(err, result) {
      if (err) {
        deferred.reject(err);
        return;
      }

      deferred.resolve(result);
    });

    return deferred.promise;
  };

  this.getAttendanceListByDate = function() {
    var deferred = $q.defer();

    db.allDocs({ include_docs: true }, function(err, result) {
      if (err) {
        deferred.reject(err);
        return;
      }

      var attendanceListByDate = null;
      result.rows.forEach(function(course) {
        course.doc.attendance.classes
          .filter(function(attendance) {
            if (attendance.didAttend != null)
              return false;
            var isFuture = moment().diff(moment(attendance.date)) <= 0;
            if (isFuture)
              return false;

            return true;
          })
          .forEach(function(attendance) {
            attendanceListByDate = attendanceListByDate || {};
            attendanceListByDate[attendance.date] = attendanceListByDate[attendance.date] || [];

            var attendanceMoment = moment(attendance.date);
            var attendanceCount = parseInt(course.doc.classes[attendanceMoment.day()]);

            attendanceListByDate[attendance.date].push({
              courseId: course.doc._id,
              courseName: course.doc.name,
              date: attendance.date,
              count: attendanceCount
            });
          });
        });

      deferred.resolve(attendanceListByDate);
    });

    return deferred.promise;
  };

  this.getPendingAttendanceCount = function() {
    var deferred = $q.defer();
    var pendingAttendanceCount = 0;

    db.allDocs({ include_docs: true }, function(err, result) {
      if (err) {
        deferred.reject(err);
        return;
      }

      result.rows.forEach(function(course) {
        pendingAttendanceCount += course.doc.attendance.classes
          .filter(function(attendance) {
            if (attendance.didAttend != null)
              return false;
            var isFuture = moment().diff(moment(attendance.date)) <= 0;
            if (isFuture)
              return false;

            return true;
          })
          .length;
      });

      deferred.resolve(pendingAttendanceCount);
    });

    return deferred.promise;
  };

  this.insert = function(course, weekdays) {
    var self = this;
    var deferred = $q.defer();

    course = bootstrapNewCourse(course, weekdays);
    db.post(course, function(err, doc) {
      if (err) {
        defered.reject(err);
        return;
      }

      updateBadgeCounter.call(self);
      scheduleCourseNotifications.call(self, course);

      deferred.resolve(doc);
    });

    return deferred.promise;
  };

  function bootstrapNewCourse(course, weekdays) {
    var startDate = moment(course.start);
    var endDate = moment(course.end);
    var currentDate = startDate.clone();

    course.createdAt = Date.now();
    course.attendance = {
      total: 0,
      count: 0,
      skipCount: 0,
      classes: []
    };

    for (var currentDate = moment(course.start); currentDate.isBefore(endDate); currentDate.add(1, 'days')) {
      var hasClass = weekdays[currentDate.day()] == 1 ? true : false;
      var classCount = parseInt(course.classes[currentDate.day()]) || 0;

      if (hasClass && classCount > 0) {
        var attendance = {
          date: currentDate.clone().toDate(),
          didAttend: null
        }

        course.attendance.classes.push(attendance);
        course.attendance.total += parseInt(classCount);
      }
    }

    return course;
  }

  function updateBadgeCounter() {
    this
      .getPendingAttendanceCount()
      .then(function(count) {
        $cordovaBadge.set(count);
      });
  }

  function scheduleCourseNotifications(course) {
    var now = moment();
    var notifications = [];
    var classMoment;
    var notificationId;

    for (var i = 0; i < course.attendance.classes.length; i++) {
      classMoment = moment(course.attendance.classes[i].date);
      if (classMoment.isBefore(now) && !classMoment.isSame(now, 'day'))
        continue;

      classMoment.hour(20);
      notificationId = course.createdAt + i;
      notifications.push({
        id: notificationId,
        title: 'Não perca controle de suas faltas',
        text: 'Você foi na aula de ' + course.name + ' hoje?',
        at: classMoment.toDate()
      });
    }

    $cordovaLocalNotification.schedule(notifications);
  }

  this.remove = function(courseId) {
    var self = this;
    var deferred = $q.defer();

    db.get(courseId, function(err, course) {
      if (err) {
        deferred.reject(err);
        return;
      }

      course.attendance.classes.every(function(attendance, index) {
        var notificationId = course.createdAt + index;
        $cordovaLocalNotification.cancel(notificationId);
      });

      db.remove(course, function(err, result) {
        if (err) {
          deferred.reject(err);
          return;
        }

        self
          .getPendingAttendanceCount()
          .then(function(count) {
            $cordovaBadge.set(count);
          });

        deferred.resolve(result);
      });
    });

    return deferred.promise;
  };

  this.didAttend = function(courseId, date, attendanceCount) {
    var deferred = $q.defer();

    db.get(courseId, function(err, course) {
      if (err) {
        deferred.reject(err);
        return;
      }

      var attendanceIndex;
      course.attendance.classes.every(function(attendance, index) {
        if (attendance.date == date) {
          if (attendance.didAttend === null) {
            $cordovaBadge.decrease(1);
          }

          var classCount = parseInt(course.classes[moment(attendance.date).day()]);
          if (attendance.didAttend === false) {
            course.attendance.skipCount -= classCount;
          }

          var skipCount = classCount - parseInt(attendanceCount);
          if (skipCount > 0) {
            course.attendance.skipCount += skipCount;
          }

          course.attendance.count += parseInt(attendanceCount);
          attendance.didAttend = true;
          var notificationId = course.createdAt + index;
          $cordovaLocalNotification.cancel(notificationId);

          return false;
        }

        return true;
      });

      db.put(course, courseId, function(err, updatedCourse) {
        if (err) {
          deferred.reject(err);
          return;
        }

        return deferred.resolve(updatedCourse);
      })
    });

    return deferred.promise;
  };

  this.didNotAttend = function(courseId, date) {
    var deferred = $q.defer();

    db.get(courseId, function(err, course) {
      if (err) {
        deferred.reject(err);
        return;
      }

      var attendanceIndex;
      course.attendance.classes.every(function(attendance, index) {
        if (attendance.date == date) {
          if (attendance.didAttend === true) {
            course.attendance.count -= parseInt(course.classes[moment(attendance.date).day()]);
          } else {
            $cordovaBadge.decrease(1);
          }

          course.attendance.skipCount += parseInt(course.classes[moment(attendance.date).day()]);
          attendance.didAttend = false;
          var notificationId = course.createdAt + index;
          $cordovaLocalNotification.cancel(notificationId);

          return false;
        }

        return true;
      });

      db.put(course, courseId, function(err, updatedCourse) {
        if (err) {
          deferred.reject(err);
          return;
        }

        return deferred.resolve(updatedCourse);
      })
    });

    return deferred.promise;
  };

  this.clearAttendanceAtDate = function(courseId, date) {
    var deferred = $q.defer();

    db.get(courseId, function(err, course) {
      if (err) {
        deferred.reject(err);
        return;
      }

      var attendanceIndex;
      course.attendance.classes.every(function(attendance, index) {
        console.log(attendance.date, date);
        if (attendance.date == date) {
          if (attendance.didAttend === true) {
            course.attendance.count -= parseInt(course.classes[moment(attendance.date).day()]);
          } else if (attendance.didAttend === false) {
            course.attendance.skipCount -= parseInt(course.classes[moment(attendance.date).day()]);
          }

          attendance.didAttend = null;

          var notificationId = course.createdAt + index;
          $cordovaLocalNotification.cancel(notificationId);

          return false;
        }

        return true;
      });

      db.put(course, courseId, function(err, updatedCourse) {
        if (err) {
          deferred.reject(err);
          return;
        }

        return deferred.resolve(updatedCourse);
      })
    });

    return deferred.promise;
  };
}