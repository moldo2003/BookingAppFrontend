import axios, { Axios, AxiosInstance, AxiosResponse } from "axios";
import { Appointment } from "@/Models/appointmentModel"; // Import your models
import { baseURL } from "./userApiService";
import { GetGapRequest } from "@/Models/getGapRequest";
import { GetGapResponse } from "@/Models/getGapResponse";

const axiosInstance: AxiosInstance = axios.create({ baseURL });

class AppointmentApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axiosInstance;
  }

  async getFastestAppointment(
    token: string,
    neededTime: string,
    clientId: string,
    barberId: string,
    services: string[]
  ): Promise<Appointment> {
    const response = await this.axiosInstance.get<Appointment>(
      "/appointment/getFastestAppointment",
      {
        headers: { Authorization: token },
        params: { neededTime, clientId, barberId, services },
      }
    );
    return response.data;
  }

  async acceptAppointment(
    token: string,
    appointmentId: string
  ): Promise<string> {
    const response = await this.axiosInstance.post<string>(
      "/appointment/acceptAppointment",
      null,
      {
        headers: { Authorization: token },
        params: { appointmentId },
      }
    );
    return response.data;
  }

  async declineAppointment(
    token: string,
    appointmentId: string
  ): Promise<string> {
    const response = await this.axiosInstance.post<string>(
      "/appointment/declineAppointment",
      null,
      {
        headers: { Authorization: token },
        params: { appointmentId },
      }
    );
    return response.data;
  }

  async getAvailableDays(
    token: string,
    barberId: string,
    neededTime: number
  ): Promise<boolean[]> {
    const response = await this.axiosInstance.get<boolean[]>(
      "/appointment/GetAvailableDays",
      {
        headers: { Authorization: token },
        params: { barberId, neededTime },
      }
    );
    return response.data;
  }

  async getAvailableGaps(
    token: string,
    request: GetGapRequest
  ): Promise<GetGapResponse[]> {
    const response = await this.axiosInstance.post<GetGapResponse[]>(
      "/appointment/GetAvailableGaps",
      request,
      {
        headers: { Authorization: token },
      }
    );
    return response.data;
  }

  async createAppointment(
    token: string,
    appointment: {
      startDate: string;
      endDate: string;
      day: string;
      clientId: string;
      barberId: string;
      services: string[];
    }
  ): Promise<any> {
    const response = await this.axiosInstance.post(
      "/appointment/createAppointment",
      appointment,
      {
        headers: { Authorization: token },
      }
    );
    return response.data;
  }
  //TODO
  async getBarberAppointments(
    token: string,
    barberId: string,
    day: string
  ): Promise<any> {
    const response = await this.axiosInstance.get(
      "/appointment/getBarberAppointments",
      {
        headers: { Authorization: token },
        params: { barberId, day },
      }
    );
    return response.data;
  }

  async getClientAppointments(token: string, clientId: string): Promise<any> {
    const response = await this.axiosInstance.get(
      "/appointment/getClientAppointments",
      {
        headers: { Authorization: token },
        params: { clientId },
      }
    );
    return response.data;
  }

  async forceDeleteAppointment(
    token: string,
    appointmentId: string
  ): Promise<any> {
    const response = await this.axiosInstance.delete(
      "/appointment/forceDeleteAppointment",
      {
        headers: { Authorization: token },
        params: { appointmentId },
      }
    );
    return response.status;
  }

  async deleteAppointment(
    token: string,
    appointmentId: string
  ): Promise<AxiosResponse> {
    try {
      const response = await this.axiosInstance.delete(
        "/appointment/deleteAppointment",
        {
          headers: { Authorization: token },
          params: { appointmentId },
          validateStatus: function (status) {
            return status >= 200 && status < 600; // Resolve only if the status code is less than 600
          },
        }
      );
  
      return response;
    } catch (error) {
      console.error(error);
      return error as AxiosResponse<any, any>;
    }
  }
}

export default new AppointmentApiService();
