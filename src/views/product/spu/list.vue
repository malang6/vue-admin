<template>
  <div>
    <SkuList v-if="isShowAddSkuList" :item="item" @exit="exit" />
    <div v-else>
      <Category :isShowList="isShowList" />
      <SpuShowList
        v-if="isShowList"
        @showSpuList="showSpuList"
        @showSpuAddSkuList="showSpuAddSkuList"
      />
      <SpuUpdateList v-else :spuItem="spuItem" @exit="exit" />
    </div>

    <!--
      //v-show是通过display显示隐藏，所以一上来这两个组件就都有了，而传过去的item就先传了{}，后面就算有值了，SpuUpdateList里data拿到的也还是一开始的{}。所以最简单就是使用v-if。要不就在SpuUpdateList里监视item

      <SpuShowList v-show="isShowList" />
      <SpuUpdateList v-show="!isShowList" :item="item" />
    -->
  </div>
</template>

<script>
import Category from "@/components/Category";
import SpuShowList from "./spuShowList";
import SpuUpdateList from "./spuUpdateList";
import SkuList from "./skuList";
export default {
  name: "SpuList",
  data() {
    return {
      isShowList: true,
      isShowAddSkuList: false,
      spuItem: {}, //每一行的数据
      // category: {},
      item: {},
    };
  },
  methods: {
    showSpuList(row) {
      this.isShowList = false;
      this.spuItem = { ...row };
    },
    exit() {
      this.isShowList = true;
      this.isShowAddSkuList = false;
      //等spuShowList组件加载完成再发请求
      /*  const {category3Id} = this.category
      this.$nextTick(() => {
        this.$bus.$emit("change", category3Id);
      }); */
    },
    showSpuAddSkuList(row) {
      this.item = row;
      this.isShowAddSkuList = true; //显示
    },
  },
  mounted() {
    // this.$bus.$on("showSpuList", this.showSpuList);
    // this.$bus.$on("showSpuAddSkuList", this.showSpuAddSkuList);
  },
  // 组件中绑定的全局事件总线 要在组件卸载的时候，将绑定的事件解绑
  beforeDestroy() {
    // this.$bus.$off("showSpuList", this.showSpuList);
    // this.$bus.$off("showSpuAddSkuList", this.showSpuAddSkuList);
    this.$store.commit("category/SET_CATEGORY");
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
    SkuList,
  },
};
</script>
