import axios, { AxiosInstance } from 'axios';
import packageInfo from '../../package.json';

class ApiService {
  static INSTANCE: ApiService;
  static getInstance = () => {
    if (!ApiService.INSTANCE) ApiService.INSTANCE = new ApiService();
    return ApiService.INSTANCE;
  };

  APIClientRestCountry: AxiosInstance;

  constructor() {
    this.APIClientRestCountry = axios.create({
      baseURL: 'https://restcountries.com/v2',
      timeout: parseInt(process.env.TIMEOUT || '30000', 10),
      headers: {
        'X-Client-Version': packageInfo.version,
      },
    });

    this.APIClientRestCountry.interceptors.response.use(
      (config: any) => config,
      this.errorHandle,
    );
  }

  errorHandle = (error: any) => Promise.reject(error);

  setBearer = (token: string): void => {
    this.APIClientRestCountry.defaults.headers.common = {
      Authorization: `Bearer ${token}`,
    };
  };
}

export default ApiService.getInstance();
