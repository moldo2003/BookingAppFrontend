
export class Time {
    hour: number;
    minute: number;

    constructor(hour: number, minute: number) {
        this.hour = hour;
        this.minute = minute;
    }

    static compare(a : Time , b :Time): number {
        if (a.hour !== b.hour) {
            return a.hour - b.hour;
        } else {
            return a.minute - b.minute;
        }
    }

    static diference(a: Time, b: Time): number {
        return (a.hour - b.hour) * 60 + (a.minute - b.minute);
    }

    static sum(a: Time, b: Time): Time {
        let hour = a.hour + b.hour;
        let minute = a.minute + b.minute;
        if (minute >= 60) {
            hour++;
            minute -= 60;
        }
        return new Time(hour, minute);
    }
}

export class WorkDay {
    day: number;
    month: number;
    year: number;

    constructor(day: number, month: number, year: number) {
        this.day = day;
        this.month = month;
        this.year = year;
    }
}

export interface Appointment{
    _id?: string;
    day: WorkDay;
    startDate: Time;
    endDate: Time;
    clientId: number;
    barberId: number;
    services: string[];
    time: number;
    isBlocking: boolean;
    isAwaiting: boolean;
    createdAt: Date;
}

export const startTime = new Time(10, 0);
export const endTime = new Time(17, 0);

// export interface BlockedTime{
//     startDate: Time;
//     endDate: Time;
// }

// export interface WorkDay{
//     day: string;
//     appointments: Appointment[];
//     usedTime: number;
//     blockedTime: BlockedTime[];
//     startTime: Time;
//     endTime: Time;
// }

