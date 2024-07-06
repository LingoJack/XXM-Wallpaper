<script setup>
import {
  onLoad,
  onPullDownRefresh,
  onReachBottom,
  onShareAppMessage,
  onShareTimeline,
  onUnload
} from "@dcloudio/uni-app";
import {apiGetClassList, apiUserDownloadOrScoreInfo} from "../../api/apis";
import {gotoHome} from "../../utils/common";



// 分享给好友，具体参考Uniapp文档
onShareAppMessage((event)=>{
  console.log(event)
  return {
    title:'分享-'+title,
    path:'/pages/classList/classList?id='+queryParams.classid+"&name="+title,
  }
})

// 分享到朋友圈，具体参考文档
onShareTimeline(()=>{
  console.log(1)
  return {
    title:'分享-'+title,
    imageUrl:'/static/avatar.jpg',
    query:"id="+queryParams.classid+"&name="+title
  }
})


// 定义data的参数模型
const queryParams={
  pageNum:1,
  pageSize:12
};

let title;

// onLoad可以接收一个从上个页面传递过来的数据
onLoad((event)=>{
  uni.pageScrollTo({
    scrollTop:0,
    duration:100
  })

  let {id=null,name=null,type=null}=event
  if (!id&&!type){
    // 如果没有传id就返回首页
    console.log('1')
    gotoHome()
  }
  if (id){
    queryParams.classid=id;
  }
  if (type){
    queryParams.type=type;
  }
  title=name
  uni.setNavigationBarTitle({
    title:title
  })


  getClassList(queryParams);
})

// 设置触底获取更多图片
onReachBottom(()=>{
  if (!noData.value){
    queryParams.pageNum++;
    getClassList(queryParams)
  }
})

// 判断是否还有数据可以请求，以防止无效的网络请求
const noData=ref(false);

// 分类详情页面数据模型
const classList=ref([]);

// 获取分类详情页面数据
async function getClassList(data={}){
  let res;
  if (queryParams.classid){
    res = await apiGetClassList(data);
  }else if (queryParams.type){
    res = await apiUserDownloadOrScoreInfo(data);
  }

  if (res.data.length<queryParams.pageSize){
    noData.value=true;
  }
  // console.log('1')
  // 解构并拼接新获取的数据和旧的数据，这样在触底刷新的时候不会盖掉之前的数据
  classList.value=[...classList.value,...res.data];
  // 配置缓存值，方便preview那里去拿，然后放大图
  uni.setStorageSync("storageClassList",classList.value)
  // console.log('已缓存')
}

// 最上部下拉刷新
onPullDownRefresh(()=>{
  console.log('进行了顶部下拉刷新')
  classList.value=[];
  queryParams.pageNum++;
  getClassList(queryParams)
  // 记得关闭下拉刷新
  uni.stopPullDownRefresh();
})

// 离开这个页面的时候把缓存清除
onUnload(()=>{
  uni.removeStorageSync("storageClassList");
})

</script>

<template>
  <view class="classListLayout pageBackground">
    <!--  加载完成之后classList不为空或者没有更多数据，就隐藏  -->
    <view class="loadingLayout" v-if="!(classList.length||noData)">
      <uni-load-more status="loading"></uni-load-more>
    </view>

    <view class="content">
      <navigator :url="'../preview/preview?id='+item._id" class="item" v-for="item in classList" :key="item._id" open-type="redirect">
        <image :src="item.smallPicurl" mode="aspectFill"></image>
      </navigator>
    </view>
  </view>

  <!-- 触底的时候根据是否还有可以请求的数据来显示loading或者noMore -->
  <!-- 为了防止在开始的时候直接显示两个加载，所以添加一个现实条件：没有更多数据或者classList有长度 -->
  <view class="loadingLayout" v-if="classList.length||noData">
    <uni-load-more :status="noData?'noMore':'loading'"></uni-load-more>
  </view>

  <view class="safe-area-inset-bottom"></view>

</template>

<style scoped lang="scss">
.classListLayout {
  .content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5rpx;
    padding: 5rpx;
    .item {
      height: 440rpx;
      image {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
  }
}

</style>