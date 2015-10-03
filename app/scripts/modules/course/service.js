'use strict';

angular
  .module('PresenteApp.Course.service', ['PresenteApp.Course.model'])
  .service('courseService', ['$q', 'CourseModel', courseService]);

function courseService($q, CourseModel) {
  var db = new PouchDB('courses');

  this.getAll = function() {
    var deferred = $q.defer();
    var options = {
      include_docs: true
    };

    db.allDocs(options, function(err, docs) {
      if (err) {
        deferred.reject(err);
        return;
      }

      var courses = [];

      for (row in docs.rows) {
        var course = new CourseModel(docs.rows[row].doc);
        courses.push(course);
      }

      deferred.resolve(courses);
    });

    return deferred.promise;
  };

  this.insert = function(course) {
    var deferred = $q.defer();
    var course = new CourseModel(course);

    db.post(course.getData(), function(err, response) {
      if (err) {
        defered.reject(err);
        return;
      }

      deferred.resolve(response);
    });

    return deferred.promise;
  }

  this.remove = function(courseId) {
    var deferred = $q.defer();

    db.get(courseId, function(err, doc) {
      if (err) {
        deferred.reject(err);
        return;
      }

      db.remove(doc, function(err, result) {
        if (err) {
          deferred.reject(err);
          return;
        }

        deferred.resolve(result);
      });
    });

    return deferred.promise;
  }
}
