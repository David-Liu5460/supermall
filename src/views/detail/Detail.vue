<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="detailNav"></detail-nav-bar>
    <scroll class="content" ref="scroll" @scroll="contentScroll" :probe-type="3">
      <DeatilSwiper :top-images="topImages"></DeatilSwiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info ref="params" :param-info="paramInfo"></detail-param-info>
      <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
      <goods-list ref="recommend" v-bind:goods="recommends"></goods-list>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    <toast :message="message" :show="show"></toast>
  </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import DeatilSwiper from "./childComps/DeatilSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import Scroll from "../../components/common/scroll/Scroll";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import GoodsList from "../../components/content/goods/GoodsList";
  import DetailBottomBar from "./childComps/DetailBottomBar";

  import {getDetail, Goods, Shop, GoodsParam, getRecommend } from "../../network/detail";
  import {debounce, debounce1} from "../../common/utils";
  import {itemListenerMixin, backTopMixin} from "../../common/mixin"

  import {mapActions} from 'vuex'

  import Toast from "../../components/common/toast/Toast";

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DeatilSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      GoodsList,
      Scroll,
      Toast
    },
    mixins:[itemListenerMixin, backTopMixin],
    data(){
      return {
        iid: null,
        topImages: null,
        // goods: null
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0,
        message: '',
        show: false
      }
    },
    created() {
      // console.log('hahhah');
      // console.log(this.$route.params);
      // 1. 保存传入的iid
      // console.log(this.$route.params);
      this.iid = this.$route.params.iid;
      // 2. 根据iid请求详情数据
      getDetail(this.iid).then(res => {
        // 1. 轮播图数据
        console.log(res);
        const data = res.result;
        // 轮播图
        this.topImages = data.itemInfo.topImages;

        // 2. 获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services);

        // 3. 创建店铺信息
        this.shop = new Shop(data.shopInfo);

        // 4. 保存商品详情数据
        this.detailInfo = data.detailInfo;

        // 5. 获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
        // console.log(this.paramInfo);

        // 6.取出评论信息
        if(data.rate.cRate !== 0){
          this.commentInfo = data.rate.list[0];
        }
        this.$nextTick(() => {
          // 数据=>异步渲染线程=》更新DOM 与js同步线程相比，为异步线程;
          /*this.themeTopYs = [];
          // 根据最新的数据，对应的DOM已经被渲染出来
          // 但是图片依然没有加载完，目前获取到的offsetTop没有包含图片
          // offsetTop有问题都是因为图片的问题;
          this.themeTopYs.push(0);
          this.themeTopYs.push(this.$refs.params.$el.offsetTop);
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
          console.log(this.themeTopYs);*/
        })
      });
      // 3. 请求推荐数据
      getRecommend().then( res => {
        console.log(res);
        this.recommends = res.data.list;
      });
      // 4.给getThemeTopY赋值（防抖）===》提高性能
     /* this.getThemeTopY = function(){
        this.themeTopYs = [];
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        // console.log('100');
        console.log(this.themeTopYs)
      }*/
      this.getThemeTopY = debounce1(() => {
        this.themeTopYs = [];
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        this.themeTopYs.push(Number.MAX_VALUE);
        // this.ThemeTopYs.push(0);
        // console.log('100');
        console.log(this.themeTopYs)
      },300)
    },
    mounted() {
      // console.log('mounted1');
      // const refresh = debounce(this.$refs.scroll.refresh, 200);
      //
      // this.itemImgListener =  this.itemImgListener = (() => {
      //   refresh();
      // });
      // this.$bus.$on('itemImgLoad', this.itemImgListener);
    },
    updated() {
      // 根据最新的数据，对应的DOM是已经被渲染出来了
      // 但是图片依然没有加载出来(目前获取到的offsetTop不包含其中的图片)
      //offsetTop值不对，一般都是因为图片
     /* this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      console.log(this.themeTopYs);*/
    },
    destroyed() {
      this.$bus.$off('itemImgLoad', this.itemImgListener);
    },
    methods: {
      ...mapActions(['addCart']),
      /*...mapActions([
        add: 'addCart'
      ]),*/
      imageLoad() {
        // this.$refs.scroll.refresh();
        // console.log('-----------');
        this.refresh();
        this.getThemeTopY();
        // console.log(this.themeTopYs);
        /*this.themeTopYs = [];
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);*/
        // console.log(this.themeTopYs);
      },
      titleClick(index){
        // console.log(index);
        // console.log('------------');
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 300);
      },
      contentScroll(position){
        // console.log(position);
        // 1.y
        const positionY = -position.y;
        // 2. 对比
        /*if (positionY > themeTopYs[0] && positionY <  themeTopYs[1] ){
          index = 1;
        }*/
        /*for(let i in this.themeTopYs){
          if(positionY > this.themeTopYs[parseInt(i)] && positionY <  this.themeTopYs[parseInt(i+1)])
          {
            index = i;
          }
        }*/
        let length = this.themeTopYs.length;
        for(let i = 0; i < length-1; i++){
          /*if (this.currentIndex !== i && (i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]
          || i === length - 1 && positionY >= this.themeTopYs[i]))*/
          if (this.currentIndex !== i && (positionY >= this.themeTopYs[i]
            && positionY < this.themeTopYs[i+1]))
          {
            this.currentIndex = i;
            // console.log(this.currentIndex);
            this.$refs.detailNav.currentIndex = this.currentIndex;
          }
        }

        // this.isShowBackTop = (-position.y) > 1000;
        this.listenShowBackTop(position);
      },
      addToCart() {
        // 1. 获取商品信息
        const product = {};
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid;

        //2. 购物车
        // this.$store.cartlist.push(product)
        // this.$store.commit('addCart', product)
        /*this.addCart(product).then(res => {
          this.show = true;
          this.message = res;
          console.log(res);

          setTimeout(() => {
            this.show = false;
            this.message = '';
          }, 1000)
        })*/
        /*this.$store.dispatch('addCart', product).then(res => {
          console.log(res);
        });*/

        //3. 添加到购物车成功
        this.addCart(product).then(res => {
          console.log(this.$toast);

          this.$toast.showInfo(res, 1500);
        })
      }
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  .detail-nav{
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .content{
    height: calc(100% - 44px - 58px);
  }
</style>
