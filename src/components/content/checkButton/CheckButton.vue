<template>
  <div class="check-button" :class="{check: isChecked}">
    <img src="../../../assets/img/cart/tick.svg" alt="">
  </div>
</template>

<script>
  export default {
    name: "CheckButton",
    props: {
      isChecked: {
        type: Boolean,
        default: false /*用来展示非修改 修改放到vuex状态管理*/
      }
    }
  }
</script>

<style scoped>
  .check-button{
    border-radius: 50%;
    border: 2px solid #aaa;
  }

  .check{
    border-color: #f13e3a;
    background-color: #f13e3a;
  }
</style>
