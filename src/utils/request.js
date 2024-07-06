/*
    集中封装uni.request请求，是可以拷贝到其他项目稍作修改复用的~
*/

// 我的access_key,token
const ACCESS_KEY='wjjwjj';
const TOKEN='200487';

// 基地址base_url
const BASE_URL='https://tea.qingnian8.com/api/bizhi'

export function request(config={}) {
    // 从传进来的参数对象里面解构url,data等数据
    let {
        url,
        data={},
        header={
            "access-key":ACCESS_KEY,
            "token":TOKEN
        },
        method='GET'
    } =config;

    url=BASE_URL+url;
    // header['access-key']=ACCESS_KEY;
    // header['token']=TOKEN;

    return new Promise((resolve,reject)=>{

        uni.request({
            url: url,
            header:header,
            method: method,
            data:data,
            // 成功的回调
            success: res => {
                if (res.data.errCode===0){
                    resolve(res.data)
                }else if (res.data.errCode===400){
                    uni.showModal({
                        title:"错误提示",
                        content:res.data.errMsg,
                        showCancel:false
                    })
                    reject(res.data)
                }else {
                    uni.showToast({
                        title:res.data.errMsg,
                        icon:false
                    })
                    reject(res.data)
                }
            },
            // 失败的回调
            fail: err => {
                console.log(err);
                return new Promise(err);
            }
        })

    })
}

