<template>
  <div>
    <Navbar></Navbar>
    <Alter></Alter>
    <div class="container-fluid">
      <div class="row">
        <Sidebar />
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
        <!-- 這邊的 router-view 設定頁面是在 admin 下的 cildern  -->
          <router-view></router-view>
        </main>
      </div>
    </div>
  </div>
</template>    
<script>
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Alter from "./AlterMessage"
import Pagination from "./Pagination"
export default {
  // 將分開的 sidebar 、navbar 載入，template 也要插入元件
  components: {
    Sidebar,
    Navbar,
    Alter,
    Pagination,
  }
};
</script>