<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <!-- 上方產品 -->
    <div class="row mt-4">
      <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
        <div class="card border-0 shadow-sm">
          <div
            style="height: 150px; background-size: cover; background-position: center"
            :style="{backgroundImage:`url(${item.imageUrl})`}"
          ></div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{ item.category }}</span>
            <h5 class="card-title">
              <a href="#" class="text-dark">{{ item.title }}</a>
            </h5>
            <p class="card-text">{{ item.content }}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h5" v-if="!item.price">{{ item.origin_price }} 元</div>
              <del class="h6" v-if="item.price">原價 {{ item.origin_price }} 元</del>
              <div class="h5" v-if="item.price">現在只要 {{ item.price }} 元</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm"
              @click.prevent="getProduct(item.id)"
            >
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem===item.id"></i>
              查看更多
            </button>

            <button
              type="button"
              class="btn btn-outline-danger btn-sm ml-auto"
              @click.prevent="addtoCard(item.id)"
            >
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem===item.id"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- <Pagination v-bind:childPaginations="pagination" v-on:emitPagination="getProducts"></Pagination> -->

    <!-- 購物車表單 -->
    <!-- 購物資訊長度 小於/等於 零 時隱藏 此表單 -->
    <div class="row justify-content-center mt-4 d-flex" v-if="cart.carts.length!==0">
      <table class="table mt-4">
        <thead>
          <tr>
            <th></th>
            <th>品名</th>
            <th width="80">數量</th>
            <th width="120">單價</th>
          </tr>
        </thead>
        <tbody>
          <!-- cart 下有 carts 、 total、final_total ，carts 是購物車中產品 -->
          <tr v-for="item in cart.carts" :key="item.id">
            <td>
              <button class="btn btn-outline-danger" @click="openDelModal(item)">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
            <td>
              {{item.product.title}}
              <div class="text-success" v-if="item.coupon">以套用優惠卷</div>
            </td>
            <td class="text-right">{{item.qty}}/{{item.product.unit}}</td>
            <td class="text-right">{{item.total | currency}}</td>
          </tr>
          <tr>
            <td colspan="3" class="text-right">總計</td>
            <td class="text-right">{{cart.total | currency}}</td>
          </tr>
          <tr v-if="cart.final_total!==cart.total">
            <td colspan="3" class="text-right text-success">折扣後價格</td>
            <td class="text-right text-success">{{cart.final_total | currency}}</td>
          </tr>
        </tbody>
      </table>

      <!-- 套用優惠卷 -->
      <div class="input-group mb-3">
        <input type="text" class="form-control" v-model="coupon_code" placeholder="請輸入優惠碼" />
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">套用優惠卷</button>
        </div>
      </div>
      <!-- 送出表單 -->
      <div class="my-5 row justify-content-center">
        <form class="col-md-12" @submit.prevent="createOrder">
          <div class="form-group">
            <label for="useremail">Email</label>
            <input
              type="email"
              class="form-control"
              name="email"
              id="useremail"
              v-model="form.user.email"
              placeholder="請輸入 Email"
              v-validate="'required|email'"
            />
            <span class="text-danger" v-if="errors.has('email')">{{errors.first('email')}}</span>
          </div>

          <div class="form-group">
            <label for="username">收件人姓名</label>
            <input
              type="text"
              class="form-control"
              name="name"
              id="username"
              v-model="form.user.name"
              v-validate="'required'"
              placeholder="輸入姓名"
              :class="{'is-invalid':errors.has('name')}"
            />
            <span class="text-danger" v-if="errors.has('name')">姓名需輸入</span>
          </div>

          <div class="form-group">
            <label for="usertel">收件人電話</label>
            <input
              type="tel"
              class="form-control"
              id="usertel"
              v-model="form.user.tel"
              placeholder="請輸入電話"
            />
          </div>

          <div class="form-group">
            <label for="useraddress">收件人地址</label>
            <input
              type="text"
              class="form-control"
              name="address"
              id="useraddress"
              v-model="form.user.address"
              placeholder="請輸入地址"
            />
            <span class="text-danger">地址欄位不得留空</span>
          </div>

          <div class="form-group">
            <label for="comment">留言</label>
            <textarea
              name
              id="comment"
              class="form-control"
              cols="30"
              rows="10"
              v-model="form.message"
            ></textarea>
          </div>
          <div class="text-right">
            <button class="btn btn-danger">送出訂單</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 查看更多後出現的 modal -->
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{ product.title }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <!-- 這個 imageUrl 已有雙向綁定 -->
            <img :src="product.imageUrl" class="img-fluid" alt />
            <blockquote class="blockquote mt-3">
              <p class="mb-0">{{ product.content }}</p>
              <footer class="blockquote-footer text-right">{{ product.description }}</footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h4" v-if="!product.price">{{ product.origin_price | currency }} 元</div>
              <del class="h6" v-if="product.price">原價 {{ product.origin_price | currency }} 元</del>
              <div class="h4" v-if="product.price">現在只要 {{ product.price | currency }} 元</div>
            </div>
            <select name class="form-control mt-3" v-model="product.num">
              <!-- v-for：可選擇 1 ~ 10 筆 -->
              <!-- :value="num"：把 num 動態綁定成 value 的值 -->
              <!-- 單位使用 product.unit (可在產品後台設定) -->
              <option :value="num" v-for="num in 10" :key="num">選購 {{num}} {{product.unit}}</option>
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              小計
              <strong>{{ product.num * product.price | currency }}</strong> 元
            </div>
            <button
              type="button"
              class="btn btn-primary"
              @click.prevent="addtoCard(product.id,product.num)"
            >
              <i class="fas fa-spinner fa-spin"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 點擊垃圾桶 button 出現的 刪除Modal -->
    <div
      class="modal fade"
      id="delCartModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除
            <!-- 無法直接使用 {{tempCart.product.title}} -->
            <strong class="text-danger">{{tempCart.product.title}}</strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="deleteCart">確認刪除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Pagination from "../Pagination";
import $ from "jquery";

export default {
  data() {
    return {
      products: [],
      isLoading: false,
      pagination: {},
      product: {},
      cart: {
        carts: {}
      },

      tempCart: {
        product: {
          title: ""
        }
      },
      coupon_code: "",
      status: {
        loadingItem: "" //存放的值就是產品 id
      },
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: ""
        },
        message: ""
      }
    };
  },
  methods: {
    // 取得商品列表，customer_order 頁面
    getProducts(page = 1) {
      const vm = this;
      vm.isLoading = true;
      const api = `${process.env.APIPATH}api/${process.env.CUSTOMPATH}/products?page${page}`;
      this.$http.get(api).then(response => {
        console.log(response.data);
        vm.products = response.data.products;
        vm.isLoading = false;
      });
    },
    // 點擊查看更多時使用
    getProduct(id) {
      const api = `${process.env.APIPATH}api/${process.env.CUSTOMPATH}/product/${id}`;
      const vm = this;
      vm.status.loadingItem = id;
      this.$http.get(api).then(response => {
        console.log(response);
        vm.product = response.data.product;
        vm.status.loadingItem = ""; // 判斷目前畫面上是哪一個元素正在讀取中
        $("#productModal").modal("show");
      });
    },
    // 加入購物車的函式，qty = 商品數量，如果直接加到購物車，數量使用預設的 1
    addtoCard(id, qty = 1) {
      const api = `${process.env.APIPATH}api/${process.env.CUSTOMPATH}/cart`;
      const vm = this;
      const cart = {
        product_id: id,
        qty
      };
      vm.status.loadingItem = id; // vm.status.loadingItem 賦予商品 id
      this.$http.post(api, { data: cart }).then(response => {
        console.log(response);
        vm.status.loadingItem = ""; // 判斷目前畫面上是哪一個元素正在讀取中
        $("#productModal").modal("hide");
        this.getOrder(); //加到購物車後要從新讀取購物車資料
      });
    },
    // 獲得購物車商品的資料
    getOrder() {
      const api = `${process.env.APIPATH}api/${process.env.CUSTOMPATH}/cart`;
      const vm = this;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        vm.isLoading = false;
        // this.$set(vm, "cart", response.data.data);
        vm.cart = response.data.data;
        console.log(vm.cart);
      });
    },
    // 開啟刪除 Modal
    openDelModal(item) {
      this.tempCart = Object.assign({}, item);
      this.$set(this, "tempCart", item);

      console.log(this.tempCart.product.title);
      this.test = this.tempCart.product.title;
      $("#delCartModal").modal("show");
    },
    // 確認刪除
    deleteCart() {
      const vm = this;
      //刪除的檔案 存在 temCart
      const id = vm.tempCart.id;
      const api = `${process.env.APIPATH}api/${process.env.CUSTOMPATH}/cart/${id}`;
      this.$http.delete(api).then(response => {
        console.log(response);
        $("#delCartModal").modal("hide");
        this.getOrder();
      });
    },
    // 套用優惠卷
    addCouponCode() {
      const vm = this;
      //刪除的檔案 存在 temCart
      const id = vm.tempCart.id;
      const coupon = {
        code: vm.coupon_code
      };
      const api = `${process.env.APIPATH}api/${process.env.CUSTOMPATH}/coupon`;
      this.$http.post(api, { data: coupon }).then(response => {
        console.log(response);
        this.getOrder();
      });
    },
    // 送出購物訂單
    createOrder() {
      const vm = this;
      const order = vm.form;
      // vm.isLoading = true;
      const api = `${process.env.APIPATH}api/${process.env.CUSTOMPATH}/order`;
      this.$validator.validate().then(result => {
        if (result) {
          this.$http.post(api, { data: order }).then(response => {
            console.log("訂單建立", response);
            // 回傳訊息正確，跳轉至購物完成頁面
            if (response.data.success) {
              vm.$router.push(`/customer_checkorder/${response.data.orderId}`);
            }
            vm.isLoading = false;
          });
        } else {
          console.log("欄位不完整");
        }
      });
    }
  },
  created() {
    this.getProducts();
    this.getOrder();
    this.$bus.$emit("message:push", "created 的訊息", "success");
  },
  components: {
    Pagination
  }
};
</script>