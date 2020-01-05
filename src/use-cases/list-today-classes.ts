import ICourseRepository from "../repositories/course-interface";
import Course from '../entities/course';

export default (courseRepository: ICourseRepository): Promise<Course[]> => (
  new Promise(async (resolve) => {
    const courses = await courseRepository.getCourses();
    const todayClasses = courses.filter(course => course.getTodayClasses().length > 0);
    resolve(todayClasses);
  })
);
