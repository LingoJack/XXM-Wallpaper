<template>
	<view class="searchLayout">
		<view class="search">
			<uni-search-bar
			@confirm="onSearch"
			@cancel="onClear"
			@clear="onClear"
			focus=true
			placeholder="搜索"
			v-model="queryParams.keyword">
			</uni-search-bar >
		</view>

		<view v-if="!classList.length||noSearch">
			<view class="history" v-if="historySearch.length">
				<view class="topTitle">
					<view class="text">最近搜索</view>
					<view class="icon" @click="removeHistory">
						<uni-icons type="trash" size="25"></uni-icons>
					</view>
				</view>
				<view class="tabs">
					<view class="tab" v-for="tab in historySearch" :key="tab" @click="clickTab(tab)">{{tab}}</view>		
				</view>
			</view>
			
			<view class="recommend">
				<view class="topTitle">
					<view class="text">热门搜索</view>
				</view>
				<view class="tabs">				
					<view class="tab" v-for="tab in recommendList" :key="tab" @click="clickTab(tab)">{{tab}}</view>
				</view>
			</view>
		</view>

    <!--  当没有搜索结果的时候展示  -->
		<view class="noSearch" v-if="noSearch">
      <!--   使用uview-plus组件   -->
			<up-empty mode="search" icon="http://cdn.uviewui.com/uview/empty/search.png"></up-empty>
		</view>

		<view>
			<view class="list">
        <!--    这里用``来包裹就不用+来拼接字符串了而是${}来替换占位符，这叫摩尔字符串    -->
				<navigator :url="`/pages/preview/preview?id=${item._id}`"  class="item"
				v-for="item in classList" :key="item._id">				
					<image :src="item.smallPicurl" mode="aspectFill"></image>				
				</navigator>
			</view>		
			<view v-if="noData || classList.length" class="loadingLayout">
        <uni-load-more :status="noData?'noMore':'loading'" v-if="!noSearch"/>
      </view>
		</view>
	</view>
</template>

<script setup>
import {ref} from "vue";
import {onUnload,onReachBottom} from "@dcloudio/uni-app";
// import {getStorageSync} from "@dcloudio/uni-h5";
import {apiSearchData} from "../../api/apis";

//查询参数
const queryParams = ref({	
	pageNum:1,
	pageSize:12,
	keyword:""
})

//搜索历史词
const historySearch = ref(uni.getStorageSync("historySearch")||[]);
//热门搜索词
const recommendList = ref(["美女","帅哥","宠物","卡通"]);

//没有更多
const noData = ref(false);
//没有搜索结果
const noSearch = ref(false);
//搜索结果列表
const classList = ref([]);

//点击搜索
const onSearch = ()=>{
  uni.showLoading()
  // 追加、去重
  historySearch.value=[...new Set([queryParams.value.keyword,...historySearch.value])].slice(0,10)
  // 搜索放到缓存中去
  uni.setStorageSync("historySearch",historySearch.value)
  console.log(queryParams.value.keyword)
  initParams(queryParams.value.keyword)
  // 调用搜索API
  searchData()
}

//点击清除按钮
const onClear = ()=>{
  initParams()
}



//点击标签进行搜索
const clickTab = (value)=>{
  initParams(value)
	// queryParams.value.keyword=value
  onSearch()
  // queryParams.value.keyword=''
}


//点击清空搜索记录
const removeHistory = ()=>{
	uni.showModal({
		title:"是否清空历史搜索？",
		success:res=>{
			if(res.confirm){
				console.log("确认删除");
        uni.setStorageSync("historySearch",[])
        historySearch.value=getStorageSync("historySearch")
			}
		}
	})
}

//触底加载更多
onReachBottom(()=>{
  if (noData.value){
    return
  }
	queryParams.value.pageNum++
  searchData();
})

//关闭页面
onUnload(()=>{
	uni.removeStorageSync("storageClassList")
})

async function searchData(){
  try {
    let res =await apiSearchData(queryParams.value);
    classList.value=[...classList.value,...res.data];
    if (queryParams.value.pageSize>res.data.length){
      noData.value=true;
    }
    if (res.data.length===0&&classList.value.length===0){
      noSearch.value=true;
    }
    console.log(res)
    // 搜索结果放到缓存中去
    uni.setStorageSync("storageClassList",classList.value)
  }finally {
    uni.hideLoading()
  }

}

// 重置查询参数
function initParams(value){
  classList.value=[]
  noData.value=false;
  noSearch.value=false;
  queryParams.value={
    pageNum:1,
    pageSize:12,
    keyword:value||""
  }
}


</script>

<style lang="scss" scoped>
.searchLayout{
	.search{
		padding:0 10rpx;
	}
	.topTitle{
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 32rpx;
		color:#999;
	}
	.history{
		padding:30rpx;		
	}
	.recommend{
		padding:30rpx;
	}
	.tabs{
		display: flex;		
		align-items: center;
		flex-wrap: wrap;
		padding-top:20rpx;
		.tab{
			background: #F4F4F4;
			font-size: 28rpx;
			color:#333;
			padding:10rpx 28rpx;
			border-radius: 50rpx;
			margin-right: 20rpx;
			margin-top: 20rpx;
		}
	}	
	.list{
		display: grid;
		grid-template-columns: repeat(3,1fr);
		gap: 5rpx;
		padding:20rpx 5rpx;		
		.item{
			height: 440rpx;
			image{
				width: 100%;
				height: 100%;
				display: block;
			}			
		}		
	}
}
</style>
