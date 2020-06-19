import Toast from "./Toast";

const obj = {}

obj.install = function (Vue) {
  // console.log('install执行', Vue);

  // Vue.extend(Toast)
  // console.log(Toast.$el);
  // document.body.appendChild(Toast.$el)

  // 1. 创建组件构造器
  const toastConstructor = Vue.extend(Toast)
  // 2. new
  const toast = new toastConstructor()
  // 3. 手动挂载
  toast.$mount(document.createElement('div'))
  // 4. toast.$el对应的就是div
  document.body.appendChild(toast.$el);

  Vue.prototype.$toast = toast;

}

export default obj
