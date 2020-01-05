enum Weekday {
  Sunday = 0,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

export enum Attendance {
  Missed = -1,
  Unknown = 0,
  Attended = 1,
}

const cloneDateToStartOfDay = (date: Date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
};

export default class Class {
  weekday: Weekday;
  timeStart: string;
  timeEnd: string;
  attendance: Map<string, Attendance>;

  constructor(weekday: Weekday, timeStart: string, timeEnd: string) {
    if (!!timeStart === false) throw new Error('Class start time must be set');
    if (!!timeEnd === false) throw new Error('Class end time must be set');
    if (timeStart > timeEnd) throw new Error('Class start time must be before it\'s end time');

    this.weekday = weekday;
    this.timeStart = timeStart;
    this.timeEnd = timeEnd;
    this.attendance = new Map();
  }

  attendAtDate(date: Date) {
    const startOfDay = cloneDateToStartOfDay(date);
    this.attendance.set(startOfDay.toDateString(), Attendance.Attended);
  }

  missAtDate(date: Date) {
    const startOfDay = cloneDateToStartOfDay(date);
    this.attendance.set(startOfDay.toDateString(), Attendance.Missed);
  }

  getAttendanceAtDate(date: Date) {
    const startOfDay = cloneDateToStartOfDay(date);
    return this.attendance.get(startOfDay.toDateString());
  }
}
