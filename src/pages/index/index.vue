<script setup>
import CommonTitle from "../../components/common-title.vue";
import ThemeItem from "../../components/theme-item.vue";
import {onLoad, onShareAppMessage, onShareTimeline} from "@dcloudio/uni-app";
import CustomNavBar from "../../components/custom-nav-bar.vue";

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
  getBanner();
  getDayRandom();
  getNoticeList();
  getDayAwesome();
})

// 跳转到每日推荐的图片预览
function goPreview(id){
  uni.setStorageSync("storageClassList",randomList.value)
  uni.redirectTo({
    url:'../preview/preview?id='+id
  })
}

// 导入需要的已经被封装好的API函数
import {apiGetBanner, apiGetDayRandom, apiGetNoticeList, apiGetThemeAwesome} from "../../api/apis";
import {func} from "uview-plus/libs/function/test";
// 首页轮播图的数据模型
const bannerList=ref([]);
// 获取首页轮播图的数据的函数，后续会统一封装请求的内容
async function getBanner(){
  // let res = await uni.request({
  //   url:'https://tea.qingnian8.com/api/bizhi/homeBanner',
  //   header:{
  //     "access-key":'lingoaccesskey'
  //   }
  // });
  // if (res.data.errCode===0){
  //   bannerList.value=res.data.data;
  // }

  // 封装后的请求
  let res =await apiGetBanner();
  // if (res.data.errCode===0){
  //   bannerList.value=res.data.data;
  // }

  // bannerList.value=res.data.data;
  bannerList.value=res.data;
}

// 每日推荐的数据模型
const randomList=ref([]);
// 获取每日推荐数据的函数
async function getDayRandom(){
  // let res = await uni.request({
  //   url:'https://tea.qingnian8.com/api/bizhi/randomWall',
  //   header:{
  //     "access-key":'lingoaccesskey'
  //   }
  // });
  let res = await apiGetDayRandom();
  // if (res.data.errCode===0){
  //   randomList.value=res.data.data;
  // }

  // randomList.value=res.data.data;
  randomList.value=res.data;
}

// 公告信息的数据模型
const noticeList=ref([]);
// 获取公告的数据
async function getNoticeList(){
  // let res = await uni.request({
  //   url:'https://tea.qingnian8.com/api/bizhi/wallNewsList',
  //   header:{
  //     "access-key":'lingoaccesskey'
  //   },
  //   data:{
  //     select:true
  //   }
  // });
  let res=await apiGetNoticeList({select:true});
  // if (res.data.errCode===0){
  //   noticeList.value=res.data.data;
  // }

  // noticeList.value=res.data.data;
  noticeList.value=res.data;
}

// 专题精选的数据模型
const themeAwesomeList=ref([]);
// 获取专题精选的数据
async function getDayAwesome(){
  let res=await apiGetThemeAwesome({
    pageSize:3
  });
  themeAwesomeList.value=res.data;
}

function onClickBanner(item){
  if(item.target==='minProgram'){
    uni.navigateToMiniProgram({
      appId:item.appid,
      path:item.url
    })
  }else {
    uni.redirectTo({
      // url是由后端返回回来的
      url:'/pages/classList/classList?'+item.url
    })
  }
}
</script>

<template>
  <!-- 这是一对标签属于多个类的写法，即属于homeLayout类，也属于pageBackground类 -->
  <!-- 关于pageBackground的样式定义在common-style.scss中 -->
  <view class="homeLayout pageBackground">
    <!-- 自定义导航栏组件 -->
    <custom-nav-bar title="推荐"></custom-nav-bar>

    <!--  轮播图  -->
    <view class="banner">
      <swiper
          indicator-dots="true"
          indicator-color="rgba(2555,255,255,0.5)"
          indicator-active-color="#fff"
          autoplay="true"
          circular="true"
      >
        <swiper-item v-for="item in bannerList" :key="item._id">
          <image :src="item.picurl" mode="aspectFill" @click="onClickBanner(item)"></image>
        </swiper-item>
      </swiper>
    </view>

    <!-- 公告轮播栏  -->
    <view class="notice">
      <view class="left">
        <uni-icons type="sound-filled" size="30"></uni-icons>
        <text class="text">公告</text>
      </view>
      <view class="center">
        <swiper vertical="true" autoplay="true" interval="1500" duration="300" circular="true">
          <swiper-item v-for="item in noticeList" :key="item._id">
            <navigator :url="'../list/detail?id='+item._id" open-type="redirect">
              {{ item.title }}
            </navigator>
          </swiper-item>
        </swiper>
      </view>
      <view class="right">
        <uni-icons type="right" size="16" color="#333"></uni-icons>
      </view>
    </view>

    <!--  每日推荐模块   -->
    <view class="awesome">
      <common-title>
        <template #name>
          每日推荐
        </template>
        <template #custom>
          <view class="date">
            <uni-icons type="calendar"></uni-icons>
            <view class="text">
              <uni-dateformat :date="Date.now()" format="dd日"></uni-dateformat>
            </view>
          </view>
        </template>
      </common-title>
      <view class="content">
        <scroll-view scroll-x="true">
          <view class="box" v-for="item in randomList" @click="goPreview(item._id)" :key="item._id">
            <image :src="item.smallPicurl" mode="aspectFill"></image>
          </view>
        </scroll-view>
      </view>
    </view>

    <!--   专题精选模块   -->
    <view class="theme">
      <common-title>
        <template #name>
          专题精选
        </template>
        <template #custom>
          <navigator url="/pages/classification/classification" open-type="reLaunch" class="more">More+</navigator>
        </template>
      </common-title>
      <view class="content">
        <theme-item v-for="item in themeAwesomeList" :key="item._id" :item="item"></theme-item>
        <theme-item :isMore="true"></theme-item>
      </view>
    </view>

  </view>
</template>

<style lang="scss" scoped>
.homeLayout {
  .banner {
    width: 750rpx;
    padding: 30rpx 0;

    swiper {
      width: 750rpx;
      height: 340rpx;
      /*&这里代表父级，即swiper*/
      &-item {
        width: 100%;
        height: 100%;
        padding: 0 30rpx;

        image {
          width: 100%;
          height: 100%;
          border-radius: 12rpx;
        }
      }
    }
  }

  .notice {
    width: 690rpx;
    height: 80rpx;
    background-color: #f9f9f9;
    margin: 0 auto;
    border-radius: 80rpx;
    display: flex;
    line-height: 80rpx;

    .left {
      width: 140rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      /*这么做在h5是可以的，但是在小程序端不行*/
      //.uni-icons{
      //  color:$brand-theme-color !important;
      //}

      //所以应该怎么写，直接穿透到组件内部
      :deep(){
        .uni-icons{
          color:$brand-theme-color !important;
        }
      }

      .text {
        color: $brand-theme-color;
        font-weight: 600;
        font-size: 28rpx;
      }
    }

    .center {
      flex: 1;

      swiper {
        height: 100%;

        &-item {
          height: 100%;
          font-size: 30rpx;
          color: #666;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }

    .right {
      wdith: 70rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }


  .awesome {
    padding-top: 50rpx;
    .date{
      color: $brand-theme-color;
      display: flex;
      align-items: center;
      /*这么写会有报错，不过可以忽略，不影响*/
      :deep(){
        .uni-icons{
          color:$brand-theme-color !important;
        }
      }
      .text{
        margin-left: 5rpx;
      }
    }

    .content {
      width: 720rpx;
      margin-left: 30rpx;
      margin-top: 30rpx;

      scroll-view {
        white-space: nowrap;

        .box {
          width: 200rpx;
          height: 430rpx;
          display: inline-block;
          margin-right: 15rpx;

          image {
            width: 100%;
            height: 100%;
            border-radius: 12rpx;
          }
        }

        /*让最后一张图片的跟最右边的距离为30rpx，与最左边对称*/
        .box:last-child {
          margin-right: 30rpx;
        }
      }
    }
  }


  .theme{
    padding: 50rpx 0;
    .more{
      font-size: 32rpx;
      color: #888;
    }

    //使用grid布局可以很好解决这类横方竖直的排列布局，repeat是列数，fr类似响应式单位
    .content{
      margin-top: 30rpx;
      padding: 0 30rpx;
      display: grid;
      gap: 15rpx;
      grid-template-columns: repeat(3,1fr);

    }
  }
}
</style>