import axios from "axios";

let BASE_TEST = ""; // base url same: https://github.com/
let axiosInstance = {}; // object save one  axios instance for app

const errorHandler = (error) => {
  // todo handler when error
  return Promise.reject({ ...error })
};

const successHandler = (response) => {
   // todo handler when response success
   return response
};

const setAxiosInstance = (timeout) => {
    /**
     * create axios instance
     * */
    axiosInstance = axios.create({
        baseURL: BASE_TEST,
        timeout: timeout,
        withCredentials: true,
    });

    /**
     * add value before for request
     * */
    axiosInstance.interceptors.request.use(function (config) {
        config.headers["Request-Id"] = ""; // generate request id
        config.requestTime = Date.now();
        return config;
    });

    /**
     * add after for response
     * */
    axiosInstance.interceptors.response.use(
        response => successHandler(response),
        error => errorHandler(error)
    )
};

export {
  axiosInstance,
  setAxiosInstance
}
