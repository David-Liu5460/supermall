<template>
  <!--ref/children-->
<!--  模板-->
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "Scroll",
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    data(){
      return {
        scroll :  null,
      }
    },
    methods: {
      scrollTo(x, y, time = 300){
        this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(x , y, time);
      },
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp();
      },
      refresh(){
        this.scroll && this.scroll.refresh();
      },
      getScrollY(){
        return this.scroll ? this.scroll.y : 0
      }
    },
    mounted() {
      // console.log(document.querySelector('.wrapper'));
      // 1. 创建Scroll对象
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: true,
        pullUpLoad: this.pullUpLoad
      })
      // 2. 监听滚动位置
      /*if (this.probeType === 2 || this.probeType === 3){
        this.scroll.on('scroll', position => {
          // console.log(position);
          this.$emit('scroll',position);
        })
      }*/
      this.scroll.on('scroll', position => {
        // console.log(position);
        this.$emit('scroll',position);
      })

      // 3. 监听上拉
      /*if (this.pullUpLoad){
        this.scroll.on('pullingUp',()=>{
          // console.log('上拉加载更多');
          this.$emit("pullingUp");
        })
      }*/
      this.scroll.on('pullingUp',()=>{
        // console.log('上拉加载更多');
        this.$emit("pullingUp");
      })
    }
  }
</script>

<style scoped>

</style>
