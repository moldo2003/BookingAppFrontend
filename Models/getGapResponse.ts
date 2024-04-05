import { Time } from './appointmentModel'; // Import your Time model

export class GetGapResponse {
  startDate: Time;
  endDate: Time;

  constructor(startDate: Time, endDate: Time) {
    this.startDate = startDate;
    this.endDate = endDate;
  }

  static fromJson(json: any): GetGapResponse {
    return new GetGapResponse(
      Time.fromJson(json.startDate), // Assuming Time has a fromJson method
      Time.fromJson(json.endDate)
    );
  }

  toJson(): any {
    return {
      startDate: this.startDate.toJson(), // Assuming Time has a toJson method
      endDate: this.endDate.toJson()
    };
  }
}