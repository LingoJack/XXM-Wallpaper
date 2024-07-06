<script setup>
//当非微信小程序端点击了联系客服后触发的事件
import {onLoad, onShareAppMessage, onShareTimeline} from "@dcloudio/uni-app";
import {getNavBarHeight} from "../../utils/system";
import {apiUserInfo} from "../../api/apis";

// 分享给好友，具体参考Uniapp文档
onShareAppMessage((event)=>{
  console.log(event)
  return {
    title:'LingoApp',
    path:'pages/index/index',
  }
})

// 分享到朋友圈，具体参考文档
onShareTimeline(()=>{
  return {
    title:'LingoApp@wenjunjie',
    imageUrl:'/static/avatar.jpg'
  }
})

function clickContact(){
  //调用uni-api拨打电话
  uni.makePhoneCall({
    phoneNumber:"15627338523",

  })
}
onLoad(()=>{
  uni.pageScrollTo({
    scrollTop:0,
    duration:100
  })
  getUserInfo()
})

function toMyDownload(){
  uni.redirectTo({
    url:'/pages/classList/classList?name=我的下载&type=download',
  })
}

function toMyEvaluate(){
  uni.redirectTo({
    url:'/pages/classList/classList?name=我的评分&type=score',
  })
}

// 订阅更新
function subscribeUpdate(){
  uni.redirectTo({
    url:'/pages/list/detail?id=653507c6466d417a3718e94b&name=订阅更新',
  })
}

// 常见问题
function commonProblem(){
  uni.redirectTo({
    url:'/pages/list/detail?id=6536358ce0ec19c8d67fbe82&name=常见问题',
  })
}

// 用户信息数据模型
const userInfo=ref({})
async function getUserInfo(){
  let res = await apiUserInfo();
  console.log(res)
  userInfo.value=res.data;
}

</script>

<template>
  <view class="userLayout pageBackground" v-if="userInfo">

    <view :style="{height:getNavBarHeight()+'px'}"></view>
    <view class="userInfo">
      <view class="avatar">
        <image class="pic" src="@/static/avatar.jpg" mode="aspectFill"></image>
      </view>
      <view class="ip">{{ userInfo.IP }}</view>
      <view class="address">来自于：{{ userInfo.address.city||userInfo.address.province||userInfo.address.country }}</view>
    </view>

    <view class="section">
      <view class="list">
        <!--  上半侧列表   -->
        <view class="row" @click="toMyDownload">
          <view class="left">
            <uni-icons type="download-filled" size="30"></uni-icons>
            <view class="text">我的下载</view>
          </view>
          <view class="right">
            <view class="text">{{userInfo.downloadSize}}</view>
            <uni-icons type="right" size="15" color="#aaaaaa"></uni-icons>
          </view>
        </view>

        <view class="row" @click="toMyEvaluate">
          <view class="left">
            <uni-icons type="star-filled" size="30"></uni-icons>
            <view class="text">我的评分</view>
          </view>
          <view class="right">
            <view class="text">{{userInfo.scoreSize}}</view>
            <uni-icons type="right" size="15" color="#aaaaaa"></uni-icons>
          </view>
        </view>

        <view class="row">
          <view class="left">
            <uni-icons type="chatboxes-filled" size="30"></uni-icons>
            <view class="text">联系客服</view>
          </view>
          <view class="right">
            <view class="text"></view>
            <uni-icons type="right" size="15" color="#aaaaaa"></uni-icons>
          </view>
          <!--     使用条件编译     -->
          <!--    不是微信小程序的时候编译      -->
          <!-- #ifndef MP-WEIXIN -->
          <button @click="clickContact">拨打客服电话</button>
          <!-- #endif -->
          <!--     是微信小程序的时候编译     -->
          <!-- #ifdef MP-WEIXIN -->
          <button open-type="contact">联系客服</button>
          <!-- #endif -->
        </view>
      </view>
    </view>

    <!--  下半侧列表   -->
    <view class="section">
      <view class="list">
        <view class="row" @click="subscribeUpdate">
          <view class="left">
            <uni-icons type="notification-filled" size="30" color=""></uni-icons>
            <view class="text">订阅更新</view>
          </view>
          <view class="right">
            <view class="text"></view>
            <uni-icons type="right" size="15" color="#aaaaaa"></uni-icons>
          </view>
        </view>

        <view class="row" @click="commonProblem">
          <view class="left">
            <uni-icons type="flag-filled" size="30" color=""></uni-icons>
            <view class="text">常见问题</view>
          </view>
          <view class="right">
            <view class="text"></view>
            <uni-icons type="right" size="15" color="#aaaaaa"></uni-icons>
          </view>
        </view>
      </view>
    </view>
  </view>

  <view class="loadingLayout" v-else>
    <uni-load-more status="loading"></uni-load-more>
  </view>

</template>

<style scoped lang="scss">
.userLayout{
  .userInfo{
    //flex布局适合做居中
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 50rpx 0;
    .avatar{
      width: 160rpx;
      height: 160rpx;
      border-radius: 50%;
      overflow: hidden;
    }
    .ip{
      font-size: 44rpx;
      color: #333;
      padding: 20rpx 0 5rpx;
    }
    .address{
      font-size: 28rpx;
      color: #ABABAB;
    }
  }

  .section{
    width: 690rpx;
    margin: 50rpx auto;
    border: 1px solid #eee;
    border-radius: 12rpx;
    box-shadow: 0 0 30rpx rgba(0,0,0,0.15);
    .list{
      .row{
        background-color: #ffffff;
        display: flex;
        //让元素两端对齐
        justify-content: space-between;
        align-items: center;
        padding: 0 30rpx;
        height: 100rpx;
        border-bottom: 1px solid #eeeeee;
        //去除掉最后一个row的边框，因为会和父类的border重叠
        &:last-child{border-bottom: 0};
        position: relative;
        .left{
          display: flex;
          align-items: center;
          justify-content: center;
          :deep(){
            .uni-icons{
              color:$brand-theme-color !important;
            }
          }
          .text{
            padding-left: 20rpx;
            color: #666666;
          }
        }
        .right{
          display: flex;
          align-items: center;
          justify-content: center;
          .text{
            font-size: 28rpx;
            padding-left: 20rpx;
            color: #aaaaaa;
          }
        }
        button{
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          //设置透明度为0，即不可见
          opacity: 0;
        }
      }
    }
  }

}
</style>