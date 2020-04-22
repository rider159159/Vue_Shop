<template>
  <div>
    <!-- <loading :active.sync="isLoading"></loading> -->
    <div class="text-right mt-4">
      <!-- Button trigger modal -->
      <button class="btn btn-primary" @click="openCoupons(true)">建立新優惠券</button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>名稱</th>
          <th>折扣百分比</th>
          <th>到期日</th>
          <th>是否啟用</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in coupons" :key="item.id">
          <td>{{ item.title }}</td>
          <td>{{ item.percent }}%</td>
          <td>{{ item.now_date | date}}</td>
          <td>
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else class="text-danger">未啟用</span>
          </td>
          <td>
            <div class="btn-group" role="group" aria-label="Basic example">
              <button class="btn btn-sm btn-outline-primary" @click="openCoupons(false,item)">編輯</button>
              <button class="btn btn-sm btn-outline-danger" @click="openDelCoupon(item)">刪除</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination v-bind:childPaginations="pagination" @changeCurrentPage="getCoupons"></Pagination>

    <!-- 分頁 -->
    <!-- 新增/修改 Modal -->
    <div
      class="modal fade"
      id="couponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增優惠券</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="title">優惠券名稱</label>
              <input
                type="text"
                class="form-control"
                id="title"
                placeholder="請輸入優惠券名稱"
                v-model="tempCoupon.title"
              />
            </div>
            <div class="form-group">
              <label for="couponCode">優惠碼</label>
              <input
                type="text"
                class="form-control"
                id="couponCode"
                placeholder="請輸入優惠碼"
                v-model="tempCoupon.code"
              />
            </div>
            <div class="form-group">
              <label for="dueDate">到期日</label>
              <input type="date" class="form-control" id="dueDate" v-model="now_date" />
            </div>
            <div class="form-group">
              <label for="percent">折扣百分比</label>
              <input
                type="number"
                class="form-control"
                id="percent"
                placeholder="請輸入折扣百分比"
                v-model="tempCoupon.percent"
              />
            </div>
            <div class="form-group">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :true-value="1"
                  :false-value="0"
                  id="is_enabled"
                  v-model="tempCoupon.is_enabled"
                />
                <label class="form-check-label" for="is_enabled">是否啟用</label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="updateCoupon">確認</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 刪除 Modal" -->
    <div
      class="modal fade"
      id="delCouponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除優惠券</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除
            <strong class="text-danger"></strong> 優惠券？（刪除後將無法恢復）
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="deleteCoupon">確認刪除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import Pagination from "../Pagination";

export default {
  data() {
    return {
      tempCoupon: {},
      coupons: [],
      isNew: false,
      pagination: {},
      // now_date 就是當前時間
      now_date: new Date() //Tue Apr 21 2020 17:48:24 GMT+0800 (台北標準時間)
    };
  },
  methods: {
    // init 優惠卷
    getCoupons(page = 1) {
      const vm = this;
      const api = `${process.env.APIPATH}api/${process.env.CUSTOMPATH}/admin/coupons?page=${page}`;
      this.$http.get(api).then(response => {
        console.log(response.data);
        vm.coupons = response.data.coupons;
        vm.pagination = response.data.pagination;
      });
    },
    // 建立、編輯優惠
    openCoupons(isNew, item) {
      const vm = this;
      if (isNew) {
        vm.now_date = new Date();
        this.tempCoupon = {};
        this.isNew = true;
      } else {
        //編輯
        this.tempCoupon = Object.assign({}, item);
        console.log(this.tempCoupon);
        this.isNew = false;
        //  將時間戳轉換成 年+月+日
        const dateAndTime = new Date(vm.tempCoupon.now_date * 1000)
          .toISOString()
          .split("T");
        console.log(dateAndTime);
        vm.now_date = dateAndTime[0];
      }
      $("#couponModal").modal("show");
    },
    // 確認優惠
    updateCoupon() {
      //true =上傳
      let api = `${process.env.APIPATH}api/${process.env.CUSTOMPATH}/admin/coupon`;
      const vm = this;
      let httpMethod = "post";
      if (!vm.isNew) {
        api = `${process.env.APIPATH}api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;
        httpMethod = "put";
      }
      this.$http[httpMethod](api, { data: vm.tempCoupon }).then(response => {
        console.log(response.data);
        if (response.data.success) {
          $("#couponModal").modal("hide");
          vm.getCoupons();
        } else {
          $("#couponModal").modal("hide");
          vm.getCoupons();
          console.log("新增失敗");
        }
      });
    },
    openDelCoupon(item) {
      this.tempCoupon = item;
      $("#delCouponModal").modal("show");
    },
    // 刪除優惠卷
    deleteCoupon() {
      const vm = this;
      const api = `${process.env.APIPATH}api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;
      this.$http.delete(api).then(response => {
        console.log(response.data);
        if (response.data.success) {
          $("#delCouponModal").modal("hide");
          vm.getCoupons();
        } else {
          $("#delCouponModal").modal("hide");
          vm.getCoupons();
          console.log("刪除失敗");
        }
      });
    }
  },
  watch: {
    // Wed Apr 22 2020 11:41:13 GMT+0800 (台北標準時間) 轉換成時間戳
    now_date() {
      const vm = this;
      const timestamp = Math.floor(new Date(vm.now_date) / 1000);
      vm.tempCoupon.now_date = timestamp;
    }
  },
  created() {
    this.getCoupons(); // init
  },
  components: {
    Pagination
  }
};
</script>