import axios from "axios";
import Cookies from 'js-cookie';

axios.defaults.timeout = 50000;

/* eggjs 默认值，可修改 */
const xsrfCookieName = 'csrfToken';
const xsrfHeaderName = 'x-csrf-token';

const http = axios.create({
  withCredentials: true,
  xsrfCookieName,
  xsrfHeaderName,
});

http.interceptors.request.use(
  (config) => {
    /* header 中添加 csrfToken */
    config.headers[xsrfHeaderName] = Cookies.get(xsrfCookieName);
    return config;
  },
  (error) => Promise.reject(error),
);
const base ='https://service-h5avg25k-1307965096.gz.apigw.tencentcs.com/release'
// const base ='http://127.0.0.1:7001'
function getSlotsRemain() {
  return axios.get(`${base}/api/get-remain`);
}
function applyAction(params) {
  return axios.get(`${base}/api/apply-slot`, {params});
}
function getRslt(params) {
  return axios.get(`${base}/api/reslt`, {params});
}
function setSlots(params) {
  return axios.get(`${base}/api/times-slots-set`, {params});
}
export { getSlotsRemain, applyAction,getRslt,setSlots };
