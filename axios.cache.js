import axios from "axios";
import { cacheAdapterEnhancer } from "axios-extensions";
import LRUCache from "lru-cache";

const BASE_TEST = "";
const API_TIMEOUT = 30 // sec
const API_CACHE_MAX_ITEM = 100;
const API_CACHE_EXPIRE_TIME = 10 * 60 // 10 mi

let cacheInstance = {};
const setCacheInstance = (options) => {
    cacheInstance = new LRUCache(options);
};

let axiosInstance = {};
const setAxiosInstance = (timeCache, timeout) => {
    /**
     * create axios instance
     * */
    axiosInstance = axios.create({
        baseURL: BASE_TEST,
        headers: {
            "Cache-Control": "no-cache"
        },
        adapter: cacheAdapterEnhancer(axios.defaults.adapter, {
            enabledByDefault: false,
            defaultCache: cacheInstance,
            threshold: timeCache,
            cacheFlag: 'useCache',
        }),
        timeout: timeout,
        withCredentials: true,
    });
};

setCacheInstance({
    max: API_CACHE_MAX_ITEM,
    maxAge: API_CACHE_EXPIRE_TIME * 1000
});

setAxiosInstance(API_CACHE_EXPIRE_TIME * 1000, API_TIMEOUT * 1000);

export {
    axiosInstance,
    setAxiosInstance,

    cacheInstance,
    setCacheInstance,
};
