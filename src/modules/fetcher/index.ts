import { AxiosInstance, AxiosResponse } from 'axios';
const axios = require('axios');

class Fetcher {
  private readonly bearerToken: string | null;
  private readonly api: AxiosInstance;

  constructor(bearerToken: string | null = null) {
    this.bearerToken = bearerToken;
    this.api = axios.create();
    this.api.interceptors.request.use(async config => {
      if (this.bearerToken) {
        return {
          ...config,
          headers: { Authorization: `Bearer ${this.bearerToken}` },
        };
      }
      return config;
    });
    this.api.interceptors.response.use((response: AxiosResponse) => {
      return response.data;
    });
  }

  async getData<T>(url: string, params?: object): Promise<T> {
    return await this.api.get(url, { params });
  }

  async postData<T>(url: string, params?: object): Promise<T> {
    return await this.api.post(url, { ...params });
  }
}
module.exports = Fetcher;
