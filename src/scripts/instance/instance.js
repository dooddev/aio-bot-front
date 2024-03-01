import axios from "axios";
import { getAccessToken } from "./helpers";
import { urlSkipAccessToken } from "./constants";

export const BASE_URL = "http://34.70.151.217:5000/v2";
export const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

instance.interceptors.request.use(async (config) => {
  if (config.url && urlSkipAccessToken.includes(config.url)) {
    return config;
  }
  const accessToken = await getAccessToken();
  if (accessToken) {
    console.log(accessToken);
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});
