import axios, { AxiosInstance } from 'axios';

import { User } from '@/Models/userModel';
import { Barber ,Service} from '@/Models/barberModel';

// Define the base URL
export const baseURL = "http://192.168.0.106:3000";

// Create an Axios instance with the base URL
const axiosInstance: AxiosInstance = axios.create({
  baseURL,
});

// Define the API service class
class UserApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axiosInstance;
  }

  async getBarbers(token: string): Promise<Barber[]> {
    const response = await this.axiosInstance.get<Barber[]>('/user/getBarbers', {
      headers: { Authorization: token },
    });
    return response.data;
  }

  async getPhotos(token: string): Promise<string[]> {
    const response = await this.axiosInstance.get<string[]>('/user/getAllPhotos', {
      headers: { Authorization: token },
    });
    return response.data;
  }

  async removePhoto(token: string, userUid: string, photo: string): Promise<void> {
    await this.axiosInstance.delete("/admin/removePhoto", {
      headers: { Authorization: token },
      params: { userUid, photo },
    });
  }

  async createUser(token: string, userUid: string, email: string, name: string, phonenumber: string): Promise<string> {
    const response = await this.axiosInstance.post<string>("/user/create", null, {
      headers: { Authorization: token },
      params: { userUid, email, name, phonenumber },
    });
    return response.data;
  }

  async getUser(token: string): Promise<User> {
    const response = await this.axiosInstance.get<User>('/user/getUser', {
      headers: { Authorization: token },
    });
    return response.data;
  }

  async getUsers(token: string): Promise<User[]> {
    const response = await this.axiosInstance.get<User[]>('/user/getUsers', {
      headers: { Authorization: token },
    });
    return response.data;
  }

  async getServices(token: string, barberUid: string): Promise<Service[]> {
    const response = await this.axiosInstance.get<Service[]>('/barber/getServices', {
      headers: { Authorization: token },
      params: { barberUid },
    });
    return response.data;
  }
}

// Export an instance of the service
export default new UserApiService();
