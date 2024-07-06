<template>
	<view class="layout">
		<view class="navbar">
			<view class="statusBar" :style="{height:getStatusBarHeight()+'px'}"></view>
			<view class="titleBar" 
			:style="{height:getNavBarHeight()+'px',marginLeft:getLeftIcon()+'px'}">
				<view class="title">{{title}}</view>
				<navigator url="/pages/search/search" class="search" open-type="redirect">
					 <uni-icons class="icon" type="search" color="#888" size="18"></uni-icons>
					 <text class="text">搜索</text>
				</navigator>
			</view>
		</view>
		
		<view class="fill" :style="{height:getBarBoxHeight()+'px'}">
			
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import {getNavBarHeight,getStatusBarHeight,getBarBoxHeight,getLeftIcon} from "../utils/system";

defineProps({
	title:{
		type:String,
		default:"壁纸"
	}
})


</script>

<style lang="scss" scoped>
.layout{
	.navbar{
		position: fixed;
		top:0;
		left:0;
		width: 100%;
		z-index: 10;
		background:
        /*设置从上到下的渐变 后面的是从该颜色占页面的多少*/
        linear-gradient(to bottom,rgba(0,0,0,0),#ffffff 400rpx),
          /*设置从左到右的渐变*/
        linear-gradient(to right,#FFC7CE 20%,#C2F2D0);
		.statusBar{}
		.titleBar{
			display: flex;	
			align-items: center;
			padding:0 30rpx;
				
			.title{
				font-size: 22px;
				font-weight: 700;
				color: $text-font-color-1;
			}
			.search{
				  width: 220rpx;
				  height: 50rpx;
				  border-radius: 60rpx;
				  background: rgba(255,255,255,0.4);
				  border:1px solid #fff;
				  margin-left:30rpx;
				  color:#999;
				  font-size: 28rpx;
				  display: flex;
				  align-items: center;
				  .icon{
					  margin-left:5rpx;
				  }
				  .text{
					  padding-left:10rpx;
				  }
			}
		}
	}
	.fill{
		
	}
}
</style>