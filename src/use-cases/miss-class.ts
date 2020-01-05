import ICourseRepository from "../repositories/course-interface";
import { Attendance } from '../entities/class';

export default (courseRepository: ICourseRepository, courseId: number, classIndex: number, date: Date): Promise<number> => (
  new Promise(async (resolve, reject) => {
    try {
      const foundCourse = await courseRepository.findCourseById(courseId);
      foundCourse.setAttendanceForClassIndexAtDate(Attendance.Missed, classIndex, date);
      await courseRepository.updateCourseWithId(foundCourse, courseId);
      resolve(courseId);
    } catch (e) {
      reject(e);
    }
  })
);
