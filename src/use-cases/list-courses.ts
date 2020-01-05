import ICourseRepository from '../repositories/course-interface';
import Course from '../entities/course';

export default (courseRepository: ICourseRepository): Promise<Course[]> => {
  return courseRepository.getCourses();
};
