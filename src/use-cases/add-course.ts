import ICourseRepository from '../repositories/course-interface';
import Course from '../entities/course';
import Class from '../entities/class';

export default (courseRepository: ICourseRepository, courseData: {
  name: string,
  color: string,
  dateStart: Date,
  dateEnd: Date,
  schedule: Array<{
    weekday: number,
    timeStart: string,
    timeEnd: string,
  }>
}): Promise<number> => new Promise(async (resolve, reject) => {
  try {
    const schedule = courseData.schedule.map((classData) => (
      new Class(classData.weekday, classData.timeStart, classData.timeEnd)
    ));
    const course = new Course(courseData.name, courseData.dateStart, courseData.dateEnd, schedule, courseData.color);
    const result = await courseRepository.persistCourse(course);
    resolve(result);
  } catch (e) {
    reject(e);
  }
});
