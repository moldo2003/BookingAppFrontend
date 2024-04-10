import axios, { AxiosInstance } from 'axios';
import { baseURL } from './userApiService';

const axiosInstance: AxiosInstance = axios.create({ baseURL });

class BarberApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axiosInstance;
  }

  async changeSmallDescription(token: string, smallDescription: string) {
    return this.axiosInstance.post('/barber/changeSmallDescription', {}, {
      headers: { Authorization: token },
      params: { description: smallDescription },
    });
  }

  async changeBigDescription(token: string, bigDescription: string) {
    return this.axiosInstance.post('/barber/changeBigDescription', {}, {
      headers: { Authorization: token },
      params: { description: bigDescription },
    });
  }

  async getBarberPhotos(token: string) {
    return this.axiosInstance.get('/barber/getPhotos', {
      headers: { Authorization: token },
    });
  }

  async removeBarberPhotos(token: string, photo: string) {
    return this.axiosInstance.delete('/barber/removePhoto', {
      headers: { Authorization: token },
      params: { photo },
    });
  }

  async getServices(token: string) {
    return this.axiosInstance.get('/barber/getServices', {
      headers: { Authorization: token },
    });
  }

  async addService(token: string, service: any) {
    return this.axiosInstance.post('/barber/addService', service, {
      headers: { Authorization: token },
    });
  }

  async removeService(token: string, serviceName: string) {
    return this.axiosInstance.delete('/barber/removeService', {
      headers: { Authorization: token },
      params: { serviceName },
    });
  }

  async updateService(token: string, service: any) {
    return this.axiosInstance.put('/barber/updateService', service, {
      headers: { Authorization: token },
    });
  }
}

export default new BarberApiService();