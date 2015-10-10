'use strict';

angular
  .module('course.model', [])
  .factory('CourseModel', CourseModel);

function CourseModel() {
  function Course(data) {
    if (data._id)
      this._id = data._id;

    this.name = data.name;
    this.weekdays = data.weekdays;
    this.start = data.start;
    this.end = data.end;
  };

  Course.prototype.getData = function() {
    return {
      name: this.name,
      weekdays: this.weekdays,
      start: this.start,
      end: this.end,
    };
  }

  return Course;
}
