import axios from "axios";
import { getToken } from "./auth-token";

const TOKEN_HEADER = "x-captain-auth";
const APP_TOKEN_HEADER = "x-captain-app-token";
const NAMESPACE = "x-namespace";
const CAPTAIN = "captain";

export const createFetcher = (baseUrl: string) => {
  const instance = axios.create({
    baseURL: baseUrl,
    headers: {
      Referer: baseUrl,
      [NAMESPACE]: CAPTAIN,
    },
  });

  // add an interceptor to set a token
  instance.interceptors.request.use(config => {
    const token = getToken();
    if (!token || !config.headers) return config;

    config.headers[TOKEN_HEADER] = token;
    return config;
  });

  return instance;
};
