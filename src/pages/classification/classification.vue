<!--对应分类tarBar页面-->
<script setup>
import ThemeItem from "../../components/theme-item.vue";
import {onLoad, onShareAppMessage, onShareTimeline} from "@dcloudio/uni-app";
import CustomNavBar from "../../components/custom-nav-bar.vue";
import {apiGetClassification} from "../../api/apis";

// 分享给好友，具体参考Uniapp文档
onShareAppMessage((event)=>{
  console.log(event)
  return {
    title:'LingoApp',
    path:'/pages/index/index',
  }
})

// 分享到朋友圈，具体参考文档
onShareTimeline(()=>{
  return {
    title:'LingoApp@wenjunjie',
    imageUrl:'/static/avatar.jpg'
  }
})


onLoad(()=>{
  uni.pageScrollTo({
    scrollTop:0,
    duration:100
  })
  getClassification();
})

// 定义分类列表的数据模型
const classificationList=ref([]);

// 获取分类数据
async function getClassification(){
  let res = await apiGetClassification({
    pageSize:15
  });
  // console.log(res.data)
  classificationList.value=res.data;
}


</script>

<template>
  <view class="classificationLayout pageBackground">
    <custom-nav-bar title="分类"></custom-nav-bar>
    <view class="classification">
      <theme-item v-for="item in classificationList" :key="item._id" :item="item"></theme-item>
    </view>
  </view>
</template>

<style scoped lang="scss">
.classificationLayout{
  .classification{
    padding: 30rpx;
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 15rpx;
  }
}
</style>