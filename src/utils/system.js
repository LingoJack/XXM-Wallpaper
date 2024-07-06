/*
    存储一些系统信息的js，比如状态栏高度、胶囊按钮位置、大小等
*/

const SYSTEM_INFO=uni.getSystemInfoSync();
//对外暴露的方法：如果获取不到，那么返回0，处理了statusBarHeight未定义的情况
export const getStatusBarHeight=()=>(SYSTEM_INFO.statusBarHeight)||15;
export const getNavBarHeight=()=>{
    //如果有胶囊按钮
    if (uni.getMenuButtonBoundingClientRect){
        let {top,height}= uni.getMenuButtonBoundingClientRect();
        return (top - getStatusBarHeight()) * 2 + height;
    }else {
        return 40;
    }
}
export const getBarBoxHeight=()=>getNavBarHeight()+getStatusBarHeight()

//针对头条小程序
export const getLeftIcon=()=>{
    // #ifdef MP-TOUTIAO
        let {leftIcon:{left,width}}=tt.getCustomButtonBoundingClientRect();
        return left+parseInt(width)
    // #endif
    // #ifndef MP-TOUTIAO
        return 0;
    // #endif
}


