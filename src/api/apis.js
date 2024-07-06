/*
    集中定义API网络请求，便于管理与维护
*/
import {request} from "../utils/request";

// 获取首页轮播图数据
export function apiGetBanner(){
    // return uni.request({
    //     url:'https://tea.qingnian8.com/api/bizhi/homeBanner',
    //     header:{
    //         "access-key":ACCESS_KEY
    //     }
    // })

    return request({
        url:'/homeBanner'
    })
}

// 获取每日推荐的数据
export function apiGetDayRandom(){
    // return uni.request({
    //     url:'https://tea.qingnian8.com/api/bizhi/randomWall',
    //     header:{
    //         "access-key":ACCESS_KEY
    //     }
    // })

    return request({
        url:'/randomWall'
    })
}

// 获取公告数据
export function apiGetNoticeList(data={}){
    return request({
        url:'/wallNewsList',
        data:data
    })
}

// 获取专题精选数据
export function apiGetThemeAwesome(data={}){
    return request({
        url:'/classify'
    })
}

// 获取分类页面数据
export function apiGetClassification(data={}){
    return request({
        url:'/classify',
        data:data
    })
}

// 获取分类详情页面数据
export function apiGetClassList(data={}){
    return request({
        url:'/wallList',
        data:data
    })
}

// 设置壁纸评分
export function apiSetUpStar(data={}){
    return request({
        url:'/setupScore',
        data:data
    })
}

// 写入下载记录
export function apiRecordDownload(data={}){
    return request({
        url:'/downloadWall',
        data:data
    })
}

// 获取单张壁纸
export function apiDetailWall(data={}){
    return request({
        url:'/detailWall',
        data:data
    })
}

// 获取用户信息
export function apiUserInfo(data={}){
    return request({
        url:'/userInfo',
        data:data
    })
}

// 获取用户下载/评分信息
export function apiUserDownloadOrScoreInfo(data={}){
    return request({
        url:'/userWallList',
        data:data
    })
}

// 获取公告
export function apiNoticeDetail(data={}){
    return request({
        url:'/wallNewsDetail',
        data:data
    })
}

// 获取搜索数据
export function apiSearchData(data={}){
    return request({
        url:'/searchWall',
        data:data
    })
}



