import Vue from 'vue';
import Vuex from 'vuex';
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

// 1. 安装插件
Vue.use(Vuex)

const state = {
  cartList: [],
}

// 2. 创建store对象
const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})

// 挂载到vue上
export default store
// paylaod 新添加的商品
// let oldProduct = null;
// for(let item of state.cartList){
//   if(item.iid === payload.iid){
//     oldProduct = item;
//   }
// }

// 判断oldProduct
/*if (oldProduct){
  oldProduct.count += 1;
}else{
    payload.count = 1;
    state.cartList.push(payload)
}*/
/* let index = state.cartList.indexOf(payload)
 // 判断oldProduct
 if (index === -1){
   let oldProduct = state.cartList[index]
   oldProduct.count += 1;
 }else{
     payload.count = 1;
     state.cartList.push(payload)
 }*/
