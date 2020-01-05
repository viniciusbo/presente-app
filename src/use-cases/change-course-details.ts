import ICourseRepository from "../repositories/course-interface";

export default (courseRepository: ICourseRepository, courseId: number, courseData: {
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
    await courseRepository.updateCourseWithId(courseData, courseId);
    resolve(courseId);
  } catch (e) {
    reject(e);
  }
});
