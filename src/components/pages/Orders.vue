<template>
  <div>
    <Loading :active.sync="isLoading"></Loading>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>購買時間</th>
          <th>Email</th>
          <th>購買款項</th>
          <th>應付金額</th>
          <th>是否付款</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in sortOrder" :key="key">
          <td>{{ item.create_at | date }}</td>
          <td>
            <span v-text="item.user.email" v-if="item.user"></span>
          </td>
          <td>
            <ul class="list-unstyled">
              <li v-for="(product, i) in item.products" :key="i">
                {{ product.product.title }} 數量：{{ product.qty }}
                {{ product.product.unit }}
              </li>
            </ul>
          </td>
          <td class="text-right">{{ item.total | currency }}</td>
          <td>
            <strong v-if="item.is_paid" class="text-success">已付款</strong>
            <span v-else class="text-muted">尚未起用</span>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination :childPaginations="pagination" @emitPages="getOrders"></Pagination>
  </div>
</template>
<script>
import $ from "jquery";
import Pagination from "../Pagination";

export default {
  data() {
    return {
      orders: {},
      pagination: {},
      isNew: false,
      isLoading: false
    };
  },
  methods: {
    getOrders(page = 1) {
      const vm = this;
      const api = `${process.env.APIPATH}api/${process.env.CUSTOMPATH}/admin/orders?page=${page}`;
      this.$http.get(api).then(response => {
        console.log(response.data);
        vm.orders = response.data.orders;
        vm.pagination = response.data.pagination;
      });
    }
  },
  computed: {
    sortOrder() {
      const vm = this;
      let newOrder = [];
      if (vm.orders.length) {
        newOrder = vm.orders.sort((a, b) => {
            // 當 a.is_paid 是 ture 時 = 1
          const aIsPaid = a.is_paid ? 1 : 0;
          const bIsPaid = b.is_paid ? 1 : 0;
          console.log(bIsPaid - aIsPaid)
          return bIsPaid - aIsPaid;
        });
      }
      return newOrder;
    }
  },
  created() {
    this.getOrders();
  },
  components: {
    Pagination
  }
};
</script>