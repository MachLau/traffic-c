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
function getSlotsRemain(params) {
  return axios.get(`${base}/api/get-remain`, {params});
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
function downFile(params) {
  const {userName,pwd,date}=params;
    var eleLink = document.createElement('a');
    eleLink.download = '预约信息-'+date;
    eleLink.style.display = 'none';
    // 字符内容转变成blob地址
    var blob = new Blob([]);
    eleLink.href = `${base}/api/toexecl?un=${userName}&filter=${pwd}&date=${date}`;
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
}
export { getSlotsRemain, applyAction,getRslt,setSlots,downFile };
