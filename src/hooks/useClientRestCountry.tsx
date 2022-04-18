import 'regenerator-runtime/runtime';
import { useState, useEffect } from 'react';
import { AxiosRequestConfig } from 'axios';
import useSession from './useSession';
import ApiService from '../services/ApiService';
import { ACCESS_TOKEN } from '../constants';
const { setBearer, APIClientRestCountry: client } = ApiService;

export type errorStatus = {
  errorState: boolean;
  errorStatus: number;
  message: string;
};

const useClientRestCountry = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<errorStatus>({
    errorState: false,
    errorStatus: 200,
    message: '',
  });
  const [token] = useSession(ACCESS_TOKEN, '');

  useEffect(() => {
    // ? SET TOKEN FIRST IF TOKEN AVAILABLE
    if (!client.defaults.headers.common.Authorization) {
      setBearer(token);
    }
  }, []);

  const searchCountry = async (str: string, config?: AxiosRequestConfig) => {
    setLoading(true);
    try {
      let responses;
      if (str !== '') {
        responses = await client.get(
          `name/${str}?fields=name,capital,flags,alpha2Code`,
          config,
        );
      } else {
        responses = await client.get(
          `all?fields=name,capital,flags,alpha2Code`,
          config,
        );
      }
      return Promise.resolve(responses.data);
    } catch (err: any) {
      setError({
        errorState: true,
        errorStatus: err.response.status,
        message: err.message,
      });
      return Promise.reject(err);
    } finally {
      setLoading(false);
    }
  };

  const searchCountryID = async (id: string, config?: AxiosRequestConfig) => {
    setLoading(true);
    try {
      const responses = await client.get(`alpha/${id}`, config);
      return Promise.resolve(responses.data);
    } catch (err: any) {
      setError({
        errorState: true,
        errorStatus: err.response.status,
        message: err.message,
      });
      return Promise.reject(err);
    } finally {
      setLoading(false);
    }
  };

  return { searchCountry, searchCountryID, loading, error };
};

export default useClientRestCountry;
