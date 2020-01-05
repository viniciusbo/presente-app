import Class, { Attendance } from './class';

const sortScheduleByWeekday = (previous: Class, current: Class) => {
  if (previous.weekday === current.weekday) return 0;
  if (previous.weekday > current.weekday) return 1;
  if (previous.weekday < current.weekday) return -1;
};

export default class Course {
  name: string;
  dateStart: Date;
  dateEnd: Date;
  schedule: Class[];
  color: string;

  constructor(name: string, dateStart: Date, dateEnd: Date, schedule: Class[], color: string) {
    if (!!name === false) throw new Error('Course name must be set');
    if (!!dateStart === false) throw new Error('Course start date must be set');
    if (!!dateEnd === false) throw new Error('Course end date must be set');
    if (dateStart.getTime() > dateEnd.getTime()) throw new Error('Course start date can\'t be greater than it\'s end date');
    if (schedule.length === 0) throw new Error('Course schedule must contain at least one class');

    this.name = name;
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;
    this.schedule = schedule.concat();
    this.schedule.sort(sortScheduleByWeekday);
    this.color = color;
  }

  getTodayClasses(): Class[] {
    const currentWeekday = (new Date()).getDay();
    return this.schedule.filter(courseClass => (
      courseClass.weekday === currentWeekday
    ));
  }

  setAttendanceForClassIndexAtDate(attendance: Attendance, classIndex: number, date: Date) {
    const targetClass = this.schedule[classIndex];
    if (!!targetClass === false) throw new Error('Class not found');
    if (attendance === Attendance.Attended) targetClass.attendAtDate(date);
    else if (attendance === Attendance.Missed) targetClass.missAtDate(date);
  }
}
