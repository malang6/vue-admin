<template>
  <div>
    <SpuAddSkuList v-if="isShowSpuAddSkuList" :category="category" :spuInfo="spuInfo"/>
    <div v-else>
      <Category :isShowList="isShowList" />
      <SpuShowList v-if="isShowList" />
      <SpuUpdateList v-else :item="item" @exit="exit" />
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
import SpuAddSkuList from "./spuAddSkuList";
export default {
  name: "SpuList",
  data() {
    return {
      isShowList: true,
      isShowSpuAddSkuList: false,
      item: {}, //每一行的数据
      category: {},
      spuInfo: {},
    };
  },
  methods: {
    showSpuList(row) {
      this.isShowList = false;
      this.item = { ...row };
    },
    exit(category3Id) {
      this.isShowList = true;
      //等spuShowList组件加载完成再发请求
      this.$nextTick(() => {
        this.$bus.$emit("change", { category3Id });
      });
    },
    showSpuAddSkuList(category, row) {
      this.category = category;
      this.spuInfo = row;
      this.isShowSpuAddSkuList = true; //显示
    },
  },
  mounted() {
    this.$bus.$on("showSpuList", this.showSpuList);
    this.$bus.$on("showSpuAddSkuList", this.showSpuAddSkuList);
  },
  // 组件中绑定的全局事件总线 要在组件卸载的时候，将绑定的事件解绑
  beforeDestroy() {
    this.$bus.$off("showSpuList", this.showSpuList);
    this.$bus.$off("showSpuAddSkuList", this.showSpuAddSkuList);
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
    SpuAddSkuList,
  },
};
</script>
