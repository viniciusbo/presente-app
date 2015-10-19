'use strict';

angular
  .module('course.service', [])
  .service('courseService', ['$q', courseService]);

function courseService($q, CourseModel) {
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

            attendanceListByDate[attendance.date].push({
              courseId: course.doc._id,
              courseName: course.doc.name
            });
          });
        });

      deferred.resolve(attendanceListByDate);
    });

    return deferred.promise;
  };

  this.insert = function(course, weekdays) {
    var deferred = $q.defer();

    var startDate = moment(course.start);
    var endDate = moment(course.end);
    var currentDate = startDate.clone();

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

    db.post(course, function(err, result) {
      if (err) {
        defered.reject(err);
        return;
      }

      deferred.resolve(result);
    });

    return deferred.promise;
  };

  this.remove = function(course) {
    var deferred = $q.defer();

    db.remove(course, function(err, result) {
      if (err) {
        deferred.reject(err);
        return;
      }

      deferred.resolve(result);
    });

    return deferred.promise;
  };

  this.didAttend = function(courseId, date) {
    var deferred = $q.defer();

    db.get(courseId, function(err, course) {
      if (err) {
        deferred.reject(err);
        return;
      }

      var attendanceIndex;
      course.attendance.classes.every(function(attendance, index) {
        if (attendance.date == date) {
          attendance.didAttend = true;
          course.attendance.count += parseInt(course.classes[moment(attendance.date).day()]);
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
      course.attendance.classes.every(function(attendance) {
        if (attendance.date == date) {
          attendance.didAttend = false;
          course.attendance.skipCount += parseInt(course.classes[moment(attendance.date).day()]);
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
