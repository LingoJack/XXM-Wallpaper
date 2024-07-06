/*
    在这里定义一些公用的方法
*/
// 显示更新时间
export function compareTime(timestamp) {
    const now = Date.now();
    const difference = now - timestamp;

    // 将时间差转换为分钟
    const minutes = Math.floor(difference / (1000 * 60));

    if (minutes < 1) {
        return "1分钟";
    } else if (minutes < 60) {
        // ${minutes}分钟是一种字符串模板（template literal）的写法，在 JavaScript 中使用反引号（）包围字符串，可以在字符串中插入变量或表达式。$
        return `${minutes}分钟`;
    } else if (minutes < 1440) { // 一天内的分钟数
        const hours = Math.floor(minutes / 60);
        return `${hours}小时`;
    } else if (minutes < 43200) { // 一个月内的分钟数
        const days = Math.floor(minutes / 1440);
        return `${days}天`;
    } else if (minutes < 129600) { // 三个月内的分钟数
        const months = Math.floor(minutes / (1440 * 30));
        return `${months}个月`;
    } else {
        return null;
    }
}

// 某些页面缺少参数的时候调用
export function gotoHome(){
    uni.showModal({
        title:'提示',
        content:'页面有误，将返回首页',
        showCancel:false,
        success:(res)=>{
            if (res.confirm){
                uni.reLaunch({
                    url:'/pages/index/index'
                })
            }
        }
    })
}

