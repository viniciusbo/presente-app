import Course from "../entities/course";

export default interface ICourseRepository {
  getCourses(): Promise<Course[]>;
  persistCourse(course: Course): Promise<number>;
  updateCourseWithId(course: {}, courseId: number): Promise<number>;
  removeCourseById(courseId: number): Promise<boolean>;
  findCourseById(courseId: number): Promise<Course>;
}
