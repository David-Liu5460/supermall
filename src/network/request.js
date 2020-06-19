import axios from  'axios'

export function request(config) {
    // 1. 创建axios的实例
  const instance = axios.create({
    baseURL : "http://152.136.185.210:8000/api/n3",
    timeout : 5000,
    headers : {

    }
    })
  // 2. axios 拦截器
  // 请求拦截
  instance.interceptors.request.use(config => {
    // 1. 比如config中的一些信息不符合服务器要求
    // 2. 比如每次发送网络请求时候，都希望在界面显示一个请求的图标
    // 3. 某些网络请求(比如登录(token)),必须携带一些特殊的信息
    /*console.log(config);*/
    return(config);
  }, error => {
    // console.log(error);
  });
  // 响应拦截
  instance.interceptors.response.use(res => {
    // console.log(res);
    // console.log(res.data);
    return res.data;
    // return res.data;
  }, error => {
    console.log(error);
  });

  // 3.发送真正的网络请求
  return instance(config);
}

// baseURL : "http://152.136.185.210:8000/api/n3"
