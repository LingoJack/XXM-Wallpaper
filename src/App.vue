<!--
  项目接口文档：https://api.qingnian8.com/apis/wallpaper/
-->

<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style lang="scss">
@import "uview-plus/index.scss";
/*每个页面公共css */
/*使用scss之前要先安装：
    npm i sass -D
    npm i sass-loader@10.1.1 -D
*/
// 引入公共样式（外部文件）
@import "common/style/common-style.scss";
</style>
