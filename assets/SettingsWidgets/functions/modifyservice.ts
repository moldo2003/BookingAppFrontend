
import { FIREBASE_AUTH } from '@/constants/firebaseConfig';
import { baseURL } from '@/services/userApiService';
import axios from 'axios';

class ServiceModel {
  apiLink = baseURL; // replace with your base URL

  async addService(serviceName: string, servicePrice: string, serviceTime: string) {
    const token = await FIREBASE_AUTH.currentUser?.getIdToken();

    await axios.post(`${this.apiLink}/barber/addService`, {
      serviceName: serviceName,
      servicePrice: parseFloat(servicePrice),
      serviceTime: parseInt(serviceTime),
    }, {
      headers: {
        'Content-Type': 'application/json',
        'charset': 'utf-8',
        'Authorization': token,
      },
    });
  }

  async updateService(serviceName: string, servicePrice: number, serviceTime: number) {
    const token = await FIREBASE_AUTH.currentUser?.getIdToken();

    await axios.put(`${this.apiLink}/barber/updateService`, {
      serviceName: serviceName,
      servicePrice: servicePrice,
      serviceTime: serviceTime,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'charset': 'utf-8',
        'Authorization': token,
      },
    });
  }

  async deleteService(serviceName: string) {
    const token = await FIREBASE_AUTH.currentUser?.getIdToken();

    await axios.post(`${this.apiLink}/barber/removeService`, {
      serviceName: serviceName,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'charset': 'utf-8',
        'Authorization': token,
      },
    });
  }
}

export default new ServiceModel();