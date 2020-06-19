import {debounce} from "./utils";
import BackTop from "../components/content/backtop/BackTop";

export const itemListenerMixin = {
  components: {

  },
  methods: {

  },
  data(){
    return {
      itemImgListener: null,
      refresh: null
    }
  },

  mounted() {
    this.refresh = debounce(this.$refs.scroll.refresh, 200);

    this.itemImgListener = (() => {
      this.refresh();
    });
    this.$bus.$on('itemImageLoad', this.itemImgListener )
    console.log('混入');
  }
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backClick() {
      // console.log('backClick');
      this.$refs.scroll.scrollTo(0, 0, 500);
    },
    listenShowBackTop(position){
      this.isShowBackTop = (-position.y) > 1000;
    }
  }
}
