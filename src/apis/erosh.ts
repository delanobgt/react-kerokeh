import axios from "axios";

axios.defaults.timeout = 60 * 4 * 1000;

export default (config?: Record<string, string | number>): any => {
  return axios.create({
    ...config,
    baseURL: process.env.REACT_APP_EROSH_API_BASE_URL,
    headers: { authorization: "Bearer " + localStorage.getItem("auth_token") }
  });
};
