<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button :is-checked="isSelectAll"
                    class="check-button"
                    @click.native="checkClick"></check-button>
      <span>全选</span>
    </div>
    <div class="price">
      合计：{{totalPrice}}
    </div>
    <div class="calculated" @click="calcClick">
      去计算({{checkLength}})
    </div>
  </div>
</template>

<script>
  import CheckButton from "../../../components/content/checkButton/CheckButton";
  import {mapGetters} from 'vuex'

  export default {
    name: "CartBottomBar",
    components: {
      CheckButton
    },
    computed: {
      ...mapGetters(['cartList']),
      totalPrice(){
        return '$'+ this.$store.state.cartList.filter(item => {
          return item.checked;
        }).reduce((preValue, item) =>{
          return preValue += item.price * item.count;
        }, 0).toFixed(2)
      },
      checkLength() {
        return this.cartList.filter(item => item.checked).length;
      },
      isSelectAll() {
        if(this.cartList.length === 0) return false;
        // return !(this.cartList.filter(item => !item.checked).length)
        // if(this.cartList.length === 0) return false
        return !this.cartList.find(item => !item.checked);

        /*for (let item of this.cartList){
          if(!item.checked) return false
        }
        return true*/
      }
    },
    methods: {
      checkClick() {
        if(this.isSelectAll){
          this.cartList.forEach(item => item.checked = false);
        }else{
          this.cartList.forEach(item => item.checked = true);
        }
      },
      calcClick() {
        if(!this.isSelectAll){
          this.$toast.showInfo('请选择要购买的商品', 2000);
        }
      }
    }
  }
</script>

<style scoped>
  .bottom-bar {
    position: relative;
    display: flex;
    background-color: #eee;
    font-size: 14px;
    height: 40px;
    bottom: 130px;
    line-height: 40px;

    /*z-index: 1000;*/
  }

  .check-content{
    display: flex;
    align-items: center;
    margin-left: 10px;
    /*line-height: 40px;*/
    width: 90px;
  }

  .check-button{
    height: 20px;
    width: 20px;
    line-height: 20px;
    margin-right: 8px;
  }

  .price {
    margin-left: 30px;
    flex: 1;
  }

  .calculated {
    /*float: right;*/
    width: 90px;
    background-color: red;
    color: #fff;
    text-align: center;
  }
</style>
