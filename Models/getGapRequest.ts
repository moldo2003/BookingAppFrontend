import { WorkDay } from './appointmentModel'; // Import your WorkDay model

export class GetGapRequest {
  WorkDay: WorkDay;
  barberId: string;
  neededTime: number;

  constructor(day: WorkDay, barberId: string, neededTime: number) {
    this.WorkDay = day;
    this.barberId = barberId;
    this.neededTime = neededTime;
  }

  static fromJson(json: any): GetGapRequest {
    return new GetGapRequest(
      WorkDay.fromJson(json.day), // Assuming WorkDay has a fromJson method
      json.barberId,
      json.neededTime
    );
  }

  toJson(): any {
    return {
      day: this.WorkDay.toJson(), // Assuming WorkDay has a toJson method
      barberId: this.barberId,
      neededTime: this.neededTime
    };
  }
}