<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination">
      <!-- !有上一頁 = 沒有上一頁，開啟 disabled CSS -->
      <li class="page-item" :class="{'disabled':!childPaginations.has_pre}">
        <!-- 點擊後的效果是:當前頁數 -1 ，也就是往前一頁  -->
        <a
          class="page-link"
          href="#"
          aria-label="Previous"
          @click.prevent="getChildProducts(childPaginations.current_page -1)"
        >
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <!-- 為了獲得 childPaginations.total_pages 必須要用 emit 傳入 -->
      <li
        class="page-item"
        v-for="page in childPaginations.total_pages"
        :key="page"
        :class="{'active':childPaginations.current_page==page}"
      >
        <!-- page 的數字部分，getChildProducts(page) page 參數是從 v-for 傳過來的 -->
        <a class="page-link" href="#" @click.prevent="getChildProducts(page)">{{page}}</a>
      </li>
      <li class="page-item" :class="{'disabled':!childPaginations.has_next}">
        <a
          class="page-link"
          href="#"
          aria-label="Next"
          @click.prevent="getChildProducts(childPaginations.current_page +1)"
        >
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>
<script>
export default {
// props 傳送 Products 的 Paginations 物件，來到這邊 Paginations => childPaginations
props: {
    childPaginations: {
    }
  },
  methods: {
    //  getChildProducts => getProducts
    //  emit 用來傳遞 getChildProducts 的參數至 products 的 getProducts
    getChildProducts(page) {
      this.$emit("emitPagination", page);
    }
  }
};

</script>
