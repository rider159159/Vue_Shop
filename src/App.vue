<template>
  <div id="app">
    <!-- router 頁面切換時顯示的地方 -->
<router-view></router-view>
  </div>
</template>

<script>
// 為甚麼要在 created 就 post  api
export default {
  name: "App",
  // created() {
  //   // 要獲取 dev api 網址可以使用， process.env.變數名
  //   const api = `${process.env.APIPATH}api/${process.env.CUSTOMPATH}/products/all`;
  // //  使用 get() 獲得遠端 api 資料
  //  this.$http.get(api).then(response => {
  //     console.log(response.data);//遠端資料本身
  //   });
  // },
};
</script>

<style lang="scss"　>
// 載入全部　bootstrap
@import "./assets/all";
$bgc:#000;
</style>
