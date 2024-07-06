<!--
  关于小程序端的底部安全区问题，可以去修改组件uni_modules>uni-popup>components>uni-popup>uni-popup.vue

-->
<script setup>
//标识遮罩层的隐现的字段
import {getStatusBarHeight} from "../../utils/system";
import {onLoad, onShareAppMessage, onShareTimeline} from "@dcloudio/uni-app";
import {apiDetailWall, apiRecordDownload, apiSetUpStar} from "../../api/apis";
import {gotoHome} from "../../utils/common";

// 分享给好友，具体参考Uniapp文档
onShareAppMessage((event)=>{
  console.log(event)
  return {
    title:'LingoApp',
    path:'/pages/preview/preview?id='+currentId.value+"&type=share",
  }
})

// 分享到朋友圈，具体参考文档
onShareTimeline(()=>{
  return {
    title:'LingoApp@wenjunjie',
    imageUrl:'/static/avatar.jpg',
    query:'id='+currentId.value+"&type=share"
  }
})


// 遮罩层显示状态
const maskState=ref(true)

/*这些字段将在组件挂载完成的时候获取到对应元素的DOM对象
* <uni-popup ref="infoPopup" type="bottom">
* <uni-popup ref="starPopup" type="center">
* */
// 信息的弹窗
const infoPopup=ref(null)
// 评分的弹窗
const starPopup=ref(null)

//用户对壁纸的评分
const starNum=ref(0)

//点击图片实现遮罩层的隐现
function maskChange(){
  maskState.value=!maskState.value;
}

//点击信息弹窗
function clickInfo() {
  //与下面的<uni-popup ref="infoPopup" type="bottom">对应
  infoPopup.value.open();
}

//关闭信息弹窗
function clickInfoClose() {
  //与下面的<uni-popup ref="infoPopup" type="bottom">对应
  infoPopup.value.close();
}

const hasScored=ref(false);

//开启评分弹窗
function clickStar(){
  if (currentInfo.value.userScore){
    hasScored.value=true;
    starNum.value=currentInfo.value.userScore;
  }
  starPopup.value.open();
}

//关闭评分弹窗
function clickStarClose(){
  // 重置评分框
  starNum.value=0;
  starPopup.value.close();
  hasScored.value=false;
}

//当评分星星变化时触发事件
function starNumChange(){

}

//确定评分
async function submitStarNum(){
  uni.showLoading({
    title:'加载中...'
  });
  // console.log('用户确定了评分为：'+starNum.value)
  // 这里在解构的时候这么写_id:wallId就是给解构出的_id的数据起别名wallId
  let {classid,_id:wallId} = currentInfo.value;

  let res =await apiSetUpStar({
    classid:classid,
    wallId:wallId,
    userScore:starNum.value
  });
  uni.hideLoading();
  // console.log(res);
  if (res.errCode===0){
    uni.showToast({
      title: '评分成功',
      icon: "none"
    })
    // 把用户的评分写入数据
    classList.value[currentIndex.value].userScore=starNum.value;
    // 更新缓存，因为我们的info数据源是缓存，更新了才会有用户的评分
    // 如果已经评过分了，下一次请求classList数据的时候服务器返回的数据会增加一个字段userScore:{YOUR_SCORE}
    uni.setStorageSync("storageClassList",classList.value)
    // 关闭评分弹窗
    clickStarClose();
  }
}

// 回退到上一个页面
function goBack(){
  uni.navigateBack({
    success:()=>{

    },
    fail:()=>{
      uni.reLaunch({
        url:'/pages/index/index'
      })
    }
  });
}

// 存储从缓存拿来的并处理过后的数据
const classList=ref([]);

// 记录当前图片的id和数组索引
const currentId=ref(null);
const currentIndex=ref(0);

// 记录已经阅读过的图片的索引
const readImgs=ref([]);

// 在这个项目里，把图片url的_small.webp换成.jpg就是大图
onLoad(async (event)=>{
  // 接收从ClassList页面传过来的图片id
  let {id}=event;
  if (!id){
    console.log('1')
    gotoHome()
  }
  currentId.value=id;
  // console.log(id)
  // 如果不是通过分享页面进来的
  // 从缓存中获取图片数组
  let storageClassList = uni.getStorageSync("storageClassList")||[];
  // console.log('已经读取缓存');
  // 处理从缓存中获取的图片数组，改变缩略图的路径为大图
  classList.value=storageClassList.map(item=>{
    return {
      ...item,
      picurl:item.smallPicurl.replace('_small.webp','.jpg')
    }
  })

  if (event.type==='share'){
    //如果是分享进来的
    let res=await apiDetailWall({id:currentId.value})
    console.log(res)
    classList.value=res.data.map(item=>{
      return {
        ...item,
        picurl:item.smallPicurl.replace('_small.webp','.jpg')
      }
    });
  }

  // 根据从ClassList传过来的图片id获取到该图片在图片数组中的索引
  currentIndex.value = classList.value.findIndex(item=>item._id === currentId.value);
  // console.log(currentIndex.value)
  // 更定已阅图片数组
  readImgs.value.push(
      currentIndex.value===0?classList.value.length-1:currentIndex.value-1,
      currentIndex.value,
      currentIndex.value===classList.value.length-1?0:currentIndex.value+1
  )
  // 完成去重
  readImgs.value=[...new Set(readImgs.value)];
  // 获取当前图片信息
  currentInfo.value=classList.value[currentIndex.value];
  // console.log(currentInfo.value)
})

// 当前图片的信息的数据
const currentInfo=ref({
  _id:'',
  score:'',
  nickname:''
});

// 在滑动轮播图的时候触发的事件
function swiperChange(event){
  // console.log(event.detail.current);
  //@Change会有接收值，其detail里面有current属性
  // 控制切换预览图时上方图片进度的显示
  currentIndex.value=event.detail.current;
  // 更定已阅图片数组
  readImgs.value.push(
      currentIndex.value===0?classList.value.length-1:currentIndex.value-1,
      currentIndex.value,
      currentIndex.value===classList.value.length-1?0:currentIndex.value+1
  )
  // 完成去重
  readImgs.value=[...new Set(readImgs.value)];
  /*
    在 JavaScript 中，如果 currentInfo 和 classList 都是通过 ref 进行引用传递，那么它们指向的是同一个内存地址中的对象。
    因此，在函数结束后，对 classList 值的改变会影响到 currentInfo，因为它们都指向同一个对象。
  */
  currentInfo.value=classList.value[currentIndex.value];
  // console.log(currentInfo.value)
}

// 点击了下载壁纸触发的事件
async function clickDownload(){
  //处理h5端
  // #ifdef H5
  console.log("H5端点击了下载")
  uni.showModal({
    content:'请长按保存壁纸~',
    showCancel:false
  })
  // #endif

  // 处理非H5端
  // #ifndef H5
  // 处理异步同步化请求的错误可以用try...catch...
  try {
    // 下载网络图片信息需要先配置download域名白名单
    // 显示加载中，并且不让用户进行其他操作
    await uni.showLoading({
      title: '下载中...',
      mask: true
    })
    let {classid,_id:wallId}=currentInfo.value;
    // 向服务器写入下载记录
    // 这里参考之前在request.js的代码，如果状态码为400，就会返回reject(res.data)，使这个异步操作进入中止状态，
    // 控制流进入catch块进行错误处理，catch的err就是res.data
    let res = await apiRecordDownload({
      classid:classid,
      wallId:wallId
    });
    // console.log(res)
    // 下面这个是冗余的代码
    // if (res.errCode!==0){
    //
    // }
    // 先使用getImageInfo获取一个临时地址
    uni.getImageInfo({
      src:currentInfo.value.picurl,
      success:res=>{
        // console.log(res);
        uni.saveImageToPhotosAlbum({
          // filePath不支持网络图片路径，所以要先用getImageInfo这个api来获取一个临时地址res.path
          filePath:res.path,
          complete:()=>{
            /*complete无论操作成功还是失败都会被调用*/
            uni.hideLoading();
          },
          success:result=>{
            console.log(result)
          },
          fail:err=>{
            console.log(err)
            if (err.errMsg==="saveImageToPhotosAlbum:fail cancel"){
              uni.showToast({
                title:'保存失败，请重新点击下载',
                icon:"none"
              })
              return;
            }
            uni.showModal({
              title:'提示',
              content:'需要授权保存相册',
              success:result => {
                if (result.confirm){
                  console.log('授权成功')
                  /*让用户手动开启授权，给用户一个二次提示的机会*/
                  /*openSetting API详情参考Uniapp文档*/
                  uni.openSetting({
                    success:setting=>{
                      console.log(setting)
                      /*获取写入相册的授权*/
                      if (setting.authSetting['scope.writePhotosAlbum']){
                        uni.showToast({
                          title:'获取授权成功',
                          icon:"none"
                        })
                      }else {
                        uni.showToast({
                          title:'获取授权失败',
                          icon:"none"
                        })
                      }
                    }
                  })
                }
              }
            })
          }
        })
      }
    })

  }catch (err){
    console.log(err)
    uni.hideLoading()
  }
  // #endif
}

</script>

<template>
  <view class="preview">
    <!--  这里参考Uniapp的文档，swiper有一个current属性，可以控制轮播图当前的位置  -->
    <swiper circular="true" indicator-dots="true" indicator-active-color="white" indicator-color="" :current="currentIndex" @change="swiperChange">
      <swiper-item v-for="(item,index) in classList" :key="item._id">
        <!--   手动实现区域懒加载以减少用户带宽消耗     -->
        <image v-if="readImgs.includes(index)" :src="item.picurl" mode="aspectFill" @click="maskChange"></image>
      </swiper-item>
    </swiper>

    <view class="mask" v-if="maskState">
      <view class="goBack" @click="goBack" :style="{top:getStatusBarHeight()+'px'}">
        <uni-icons type="left" size="35" color="rgba(255,255,255,0.5)"></uni-icons>
      </view>

      <!--  显示图片进度    -->
      <view class="count">{{ currentIndex+1 }}/{{ classList.length }}</view>
      <view class="time">
        <uni-dateformat :date="new Date()" format="hh:mm"></uni-dateformat>
      </view>
      <view class="date">
        <uni-dateformat :date="new Date()" format="MM月dd日"></uni-dateformat>
      </view>
      <view class="footer">
        <view class="box" @click="clickInfo">
          <uni-icons type="info" size="28"></uni-icons>
          <view class="text">信息</view>
        </view>

        <view class="box" @click="clickStar">
          <uni-icons type="star" size="28"></uni-icons>
          <view class="text">5分</view>
        </view>

        <view class="box" @click="clickDownload">
          <uni-icons type="download" size="25"></uni-icons>
          <view class="text">下载</view>
        </view>
      </view>
    </view>

    <!--  info弹窗  -->
    <uni-popup ref="infoPopup" type="bottom">
      <view class="infoPopup">
        <view class="popHeader">
          <view class="blankBox"></view>
          <view class="title">
            壁纸信息
          </view>
          <view class="close" @click="clickInfoClose">
            <uni-icons type="closeempty" size="18" color="#999"></uni-icons>
          </view>
        </view>

        <scroll-view scroll-y="true">
          <view class="content">
            <view class="row">
              <text user-select="true" selectable="true" class="label">壁纸ID：</text>
              <text class="value" user-select="true" selectable="true">{{ currentInfo._id }}</text>
            </view>

<!--            <view class="row">-->
<!--              <text user-select="true" selectable="true" class="label">分类：</text>-->
<!--              <text class="value class" user-select="true" selectable="true">明星美女</text>-->
<!--            </view>-->

            <view class="row">
              <text user-select="true" selectable="true" class="label">发布者：</text>
              <text class="value" user-select="true" selectable="true">{{ currentInfo.nickname }}</text>
            </view>

            <view class="row">
              <text class="label">评分：</text>
              <view class="value rateBox">
                <uni-rate readonly :value="currentInfo.score" size="16"/>
                <text class="score" user-select="true" selectable="true">{{currentInfo.score}}</text>
              </view>
            </view>

            <view class="row">
              <text user-select="true" selectable="true" class="label">摘要：</text>
              <text class="value" user-select="true" selectable="true">{{ currentInfo.description }}</text>
            </view>

            <view class="row">
              <text user-select="true" selectable="true" class="label">标签：</text>
              <view class="value tabs">
                <view class="tab"  v-for="item in currentInfo.tabs" :key="item">
                  {{item}}
                </view>
              </view>
            </view>

            <view class="copyright">
              声明：本图片来自用户投稿，非商业使用，用于免费学习交流。如侵犯了您的权益，您可以拷贝壁纸ID
              举报至平台。邮箱:3065225677@qq.com，管理将删除侵权壁纸，维护您的权益。
            </view>
          </view>
        </scroll-view>
      </view>
    </uni-popup>

    <!--  Star弹窗   -->
    <!--
          注意这里的is-mask-click属性是控制点击遮罩外的地方关闭遮罩，默认是true
          要修改为false应该使用v-bind，否则is-mask-click会认为是true，
          即把false认为是字符串，而非空字符串会转换为true
    -->
    <uni-popup ref="starPopup" type="center" :is-mask-click="false">
      <view class="starPopup">
        <view class="popHeader">
          <view class="blankBox"></view>
          <view class="title">
            {{ hasScored?'已经评过了~':'壁纸评分' }}
          </view>
          <view class="close" @click="clickStarClose">
            <uni-icons type="closeempty" size="18" color="#999"></uni-icons>
          </view>
        </view>

        <view class="content">
          <uni-rate :disabled="hasScored" v-model="starNum" @change="starNumChange" allowHalf="true" disabled-color="#FFCA3E"></uni-rate>
          <text class="text">{{starNum}}分</text>
        </view>

        <view class="footer">
          <!--     0的时候取反就是true      -->
          <button type="default" size="mini" plain="true" :disabled="!starNum || hasScored" @click="submitStarNum">确认评分</button>
        </view>
      </view>
    </uni-popup>

  </view>
</template>

<style scoped lang="scss">
.preview{
  /*父级作定位源*/
  position: relative;
  width: 100%;
  height: 100vh;
  swiper{
    height: 100%;
    width: 100%;
    image{
      width: 100%;
      height: 100%;
    }
  }
  .mask{
    /*mask紧邻的view，这些是和mask紧邻的view标签都有的属性*/
    &>view{
      position: absolute;
      left: 0;
      right: 0;
      margin: auto;
      width: fit-content;
      color: #ffffff;
    }
    .goBack{
      //border:1px solid #e0e0e0;
      //border-radius: 50%;
      //color: white;
      //position: absolute;
      //top: 5vh;
      //left: 3vw;
      //right: 97vw;
      //padding: 5rpx;
      background-color: rgba(0,0,0,0.5);
      backdrop-filter: blur(10rpx);
      width: 38px;
      height: 38px;
      left: 30rpx;
      margin-left: 0;
      border-radius: 100rpx;
      border: 1rpx solid rgba(255,255,255,0.3);
      align-items: center;
      justify-content: center;
      //还有top的属性，写在标签内部
    }
    .count{
      top: 10vh;
      background-color: rgba(0,0,0,0.3);
      font-size: 28rpx;
      border-radius: 40rpx;
      padding: 8rpx 28rpx;
      backdrop-filter: blur(10rpx);
    }
    .time{
      font-size: 140rpx;
      top: calc(10vh + 80rpx);
      font-weight: 100;
      line-height: 1em;
      text-shadow: 0 4rpx rgba(0,0,0,0.3);
    }
    .date{
      font-size: 34rpx;
      top: calc(10vh + 230rpx);
      text-shadow: 0 2rpx rgba(0,0,0,0.3);
    }
    .footer{
      background-color: rgba(255,255,255,0.8);
      bottom: 10vh;
      width: 65vw;
      height: 120rpx;
      border-radius: 120rpx;
      color: #000;
      /*设置一行展示*/
      display: flex;
      justify-content: space-around;
      align-items: center;
      box-shadow: 0 2rpx 0 rgba(0,0,0,0.1);
      backdrop-filter: blur(20rpx);
      .box{
        padding: 2rpx 12rpx;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .text{
          font-size: 26rpx;
          color: $text-font-color-2;
        }
      }
    }
  }

  .infoPopup{
    background-color: #fff;
    padding: 30rpx;
    border-radius: 30rpx 30rpx 0 0;
    overflow: hidden;
    .popHeader{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title{
        color: $text-font-color-2;
        font-size: 26rpx;
      }
      .close{
        padding: 6rpx;
        //border: 1px solid green;
      }
    }

    scroll-view{
      max-height: 60vh;
      .content{
        .row{
          display: flex;
          padding: 16rpx 0;
          font-size: 32rpx;
          line-height: 1.7em;
          .label{
            color: $text-font-color-3;
            width: 140rpx;
            text-align: right;
            font-size: 30rpx;
          }
          .value{
            flex: 1;
            width: 0;
          }
          .rateBox{
            display: flex;
            align-items: center;
            //border: 1px solid red;
            .score{
              font-size: 26rpx;
              color: $text-font-color-2;
              padding-left: 10rpx;
            }
          }
          .tabs{
            display: flex;
            //自动换行
            flex-wrap: wrap;
            .tab{
              border: 1px solid $brand-theme-color;
              color: $brand-theme-color;
              font-size: 22rpx;
              padding: 10rpx 30rpx;
              border-radius: 40rpx;
              line-height: 1em;
              margin: 0 10rpx 10rpx 0;
            }
          }
          .class{
            color: $brand-theme-color;
          }
        }
        .copyright{
          font-size: 28rpx;
          padding: 20rpx;
          background-color: #f6f6f6;
          color: #666666;
          border: 1px solid #f6f6f6;
          border-radius: 10rpx;
          margin: 20rpx 0;
          line-height: 1.6em;
        }
      }
    }
  }

  .starPopup{
    background-color: #fff;
    padding: 30rpx;
    width: 70vw;
    border-radius: 30rpx;
    /*由于头部和infoPopup是一样的，所以这里也可以将.popHeader及其内容提取到外面来，这样就不必再重复定义样式*/
    .popHeader{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title{
        color: $text-font-color-2;
        font-size: 26rpx;
      }
      .close{
        padding: 6rpx;
        //border: 1px solid green;
      }
    }
    .content{
      padding: 30rpx 0;
      display: flex;
      justify-content: center;
      align-items: center;
      .text{
        color: #ffca3e;
        padding-left: 10rpx;
        width: 80rpx;
        line-height: 1em;
        text-align: right;
      }
    }
    .footer{
      padding: 10rpx 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>