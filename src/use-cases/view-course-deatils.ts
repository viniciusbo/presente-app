import ICourseRepository from "../repositories/course-interface";
import Course from "../entities/course";

export default (courseRepository: ICourseRepository, courseId: number): Promise<Course> => new Promise(async (resolve, reject) => {
  try {
    const course = await courseRepository.findCourseById(courseId);
    resolve(course);
  } catch (e) {
    reject(e);
  }
});
