<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control class="tab-control" :titles="['流行','新款', '精选']" @tabClick="tabClick"
                 ref="tabControl0" v-show="isTabFixed"></tab-control>
    <scroll class="content" ref="scroll" :prope-type="3" @scroll="contentScroll"
            :pull-up-load="true" @pullingUp="contentPullingUp">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <home-recommend-view :recommends="recommends"></home-recommend-view>
      <feature-view></feature-view>
      <tab-control :titles="['流行','新款', '精选']" @tabClick="tabClick"
          ref="tabControl"></tab-control>
      <!--<goods-list :goods="goods['pop'].list"></goods-list>-->
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
   <!-- <div class="wrapper">
      <div class="content">
      </div>
    </div>-->
  </div>
</template>

<script>
  import HomeSwiper from "./childComps/HomeSwiper";
  import HomeRecommendView from "./childComps/HomeRecommendView";
  import FeatureView from "./childComps/FeatureView";

  import NavBar from "../../components/common/navbar/NavBar";
  import TabControl from "../../components/content/tabControl/TabControl";
  import GoodsList from "../../components/content/goods/GoodsList";
  import Scroll from "../../components/common/scroll/Scroll";
  import BackTop from "../../components/content/backtop/BackTop";

  import {getHomeMultidata, getHomeGoods} from "../../network/home";
  import {debounce} from "../../common/utils";
  import {itemListenerMixin} from "../../common/mixin"

  // import BScroll from 'better-scroll'
  /*import {Swiper, SwiperItem} from 'components/common/swiper'*/

  export default {
    name: "Home",
    components:{
      HomeSwiper,
      HomeRecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    computed:{
      showGoods: function(){
        return this.goods[this.currentType].list
      }
    },
    mixins: [itemListenerMixin],
    data(){
      return{
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType: 'pop',
        isShowBackTop: false,
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0,
      }
    },
    destroyed() {
      console.log('home destroyed');
    },
    activated() {
      // console.log('activated');
      this.$refs.scroll.scrollTo(0, this.saveY, 0);
      this.$refs.scroll.refresh();/*不刷可能不能滚*/
    },
    deactivated() {
      // console.log('deactivated');
      // 1. 保存Y值
      this.saveY = this.$refs.scroll.getScrollY();

      // console.log(this.saveY);
      // 2. 取消全局事件的监听
      this.$bus.$off('itemImgLoad', this.itemImgListener);
    },

    created(){
      // 1. 请求多个数据
      // this 当前组件对象this
      this.getHomeMultidata();

      // 2.请求商品的数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
      // 3.手动点击一次
      this.tabClick(0);
    },
    mounted() {
      console.log('mounted');
      // this.tabClick(0);
      /* // 3. 监听图片加载完成
       const refresh = debounce(this.$refs.scroll.refresh, 200);

       // 对监听的事件进行保存
       this.itemImgListener = (() => {
         // this.$refs.scroll.refresh();
         // console.log('-------------');
         refresh();
       });
       this.$bus.$on('itemImageLoad', this.itemImgListener )*/
    },
    methods: {
      // 防抖函数
     /* debounce(func, delay){
        let timer = null;
        return function () {
          if(timer) clearTimeout(timer)
          return function (...args){
            timer = setTimeout(()=> {
              func.apply(this, args); /!* 刷新的参数给this.$refs.scroll.refresh() *!/
            }, delay)
          }
        }
      },*/
      /*
      * 事件监听相关
      * */
      tabClick(index){
        switch (index) {
          case 0:
            this.currentType = "pop"
            break
          case 1:
            this.currentType = "new"
            break
          case 2:
            this.currentType = "sell"
            break
        }
        // console.log(this.$refs.tabControl);
        if(this.$refs.tabControl0 !== undefined){
          this.$refs.tabControl0.currentIndex = index;
          this.$refs.tabControl.currentIndex = index;
        }
      },
      backClick() {
        // console.log('backClick');
        this.$refs.scroll.scrollTo(0, 0, 500);
      },
      contentScroll(position){
        // 1. 判断BackTop是否显示
        // console.log(position);
        this.isShowBackTop = (-position.y) > 1000;
        // console.log(this.isShowBackTop);
        // 2. 决定tabControl是否吸顶(position: fixed)
        // console.log((position.y));
        this.isTabFixed = ((-position.y) > this.tabOffsetTop);
      },
      contentPullingUp() {
        // console.log('上拉加载更多');
        this.getHomeGoods(this.currentType);
        // this.$refs.scroll.scroll.refresh();
      },
      swiperImageLoad(){
        // 3. 赋值
        console.log(this.$refs.tabControl.$el.offsetTop);
        this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop;
      },
      /*
      * 网络请求相关
      * */
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          console.log(res);
          console.log(res.data.banner.list);
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1;
        getHomeGoods(type, page).then(res => {
          /* 组件对象this */
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page += 1;

          this.$refs.scroll.finishPullUp();/*完成上拉加更多*/
        })
      }
    }
  }
</script>

<style scoped>
  #home {
    /*padding-top: 44px;*/
    /*padding-bottom: 400px;*/
    height: 100vh ;
    position: relative;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
    /*position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;*/
  }
  /*.tab-control{
    position: sticky;
    top: 44px;

    z-index: 9;
  }*/
  .content {
    /*height: 300px;*/
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
    /*拉伸*/
  }
  /*.content{
    height: calc(100% - 93px);
    overflow: hidden;
    margin-top: 44px;
  }*/
  /*.fixed {
    position: fixed;
    left: 0;
    right: 0;
    top: 44px;
  }*/
  .tab-control {
    position: relative;
    z-index: 9;
  }
</style>
