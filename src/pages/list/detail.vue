<script setup>
import {onLoad} from "@dcloudio/uni-app";
import {apiNoticeDetail} from "../../api/apis";
/*在需要使用mp-html组件的页面必须引入*/
import mpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html'

//  公告的详细内容
const detail=ref({})
// 公告ID
let noticeId;

async function getNoticeDetail(id){
  let res=await apiNoticeDetail({id:id});
  console.log(res)
  detail.value=res.data;
}

onLoad((e)=>{
  noticeId=e.id
  console.log(e.name)
  getNoticeDetail(noticeId);
})


</script>

<!--公告详情页面-->
<template>
  <view class="noticeLayout">
    <view class="title">
      <view class="tag" v-if="detail.select">
        <uni-tag inverted="true" text="置顶" type="error" />
      </view>
      <view class="font">{{detail.title}}</view>
    </view>

    <view class="info">
      <view class="item">{{detail.author}}</view>
      <view class="item">
        <uni-dateformat :date="detail.publish_date" format="yyyy-MM-dd hh:mm:ss"></uni-dateformat>
      </view>
    </view>

    <view class="content">
      <!--   使用Uniapp的富文本组件   -->
<!--      <rich-text :nodes="detail.content"></rich-text>-->
      <!--   使用更强大的mp-html插件   -->
      <mp-html :content="detail.content"></mp-html>
    </view>

    <view class="count">
      阅读 {{detail.view_count}}
    </view>
  </view>
</template>

<style scoped lang="scss">
.noticeLayout{
  padding: 30rpx;
  .title{
    font-size: 40rpx;
    color: #111111;
    line-height: 1.6em;
    padding-bottom: 30rpx;
    display: flex;
    .tag{
      transform: scale(0.8);
      transform-origin: left center;
      flex-shrink: 0;
    }
    .font{
      padding-left: 6rpx;
    }
  }

  .info{
    display: flex;
    align-items: center;
    color: #999;
    font-size: 28rpx;
    .item{
      padding-right: 20rpx;
    }
  }

  .content{
    padding: 50rpx 0;
  }

  .count{
    color: #999;
    font-size: 28rpX;
  }

}
</style>