import ICourseRepository from "../repositories/course-interface";

export default (courseRepository: ICourseRepository, courseId: number): Promise<boolean> => new Promise((resolve, reject) => {
  try {
    const result = courseRepository.removeCourseById(courseId);
    resolve(result);
  } catch (e) {
    reject(e);
  }
});
