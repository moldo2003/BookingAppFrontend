import axios, { AxiosInstance } from "axios";
import { baseURL } from "./userApiService";

const axiosInstance: AxiosInstance = axios.create({ baseURL });

class AdminApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axiosInstance;
  }

  async getUnvalidatedUsers(token: string) {
    return this.axiosInstance.get("/admin/getUnvalidatedUsers", {
      headers: { Authorization: token },
    });
  }

  async verifyUser(token: string, userUid: string, type: string) {
    return this.axiosInstance.get("/admin/verify", {
      headers: { Authorization: token },
      params: { userUid, type },
    });
  }

  async deleteUser(token: string, uid: string) {
    return this.axiosInstance.delete("/admin/deleteUser", {
      headers: { Authorization: token },
      params: { uid },
    });
  }

  async addBarber(token: string, userEmail: string) {
    return this.axiosInstance.post(
      "/admin/addBarber",
      {},
      {
        headers: { Authorization: token },
        params: { userEmail },
      }
    );
  }

  async removeBarber(token: string, userEmail: string) {
    return this.axiosInstance.delete("/admin/deleteBarber", {
      headers: { Authorization: token },
      params: { userEmail },
    });
  }

  async removePhoto(token: string, photo: string) {
    return this.axiosInstance.delete("/admin/removePhoto", {
      headers: { Authorization: token },
      params: { photo },
    });
  }
}

export default new AdminApiService();
