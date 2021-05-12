import axios from 'axios';
import config from '../config';
import { refreshToken } from '../redux/actions/auth';

let isRefreshing = false;
let subscribers = [];

function onRefreshed({ authorisationToken }) {
  subscribers.map(cb => cb(authorisationToken));
}

function subscribeTokenRefresh(cb) {
  subscribers.push(cb);
}

const setupAxiosInterceptors = (tokens, dispatch) => {
  const request = axios.create({
    baseURL: config.apiUrl
  });

  request.interceptors.response.use(null, err => {
    const {
      config,
      response: { status }
    } = err;
    const originalRequest = config;

    if (status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        dispatch(refreshToken(tokens)).then(newTokens => {
          isRefreshing = false;
          onRefreshed(newTokens);
          subscribers = [];
        });
      }
      return new Promise(resolve => {
        subscribeTokenRefresh(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(axios(originalRequest));
        });
      });
    }

    return Promise.reject(err);
  });

  return request;
};

export default setupAxiosInterceptors;
