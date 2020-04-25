<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="text-right mt-4">
      <button class="btn-primary btn" @click="openModel(true)">建新的產品</button>
    </div>
   <!-- 商品列表 -->
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">分類</th>
          <th>產品名稱</th>
          <th width="120">原價</th>
          <th width="120">售價</th>
          <th width="100">是否啟用</th>
          <th width="80">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in products" :key="item.id">
          <td>{{item.category}}</td>
          <td>{{item.title}}</td>
          <td class="text-right">{{item.origin_price|currency}}</td>
          <td class="text-right">{{item.price|currency}}</td>
          <td>
            <span v-if="item.is_enable" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <button class="btn-outline-primary btn btn-sm" @click="openModel(false,item)">編輯</button>
            <button class="btn-outline-danger btn btn-sm" @click="openDelModal(item)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- v-bind 配合 props ，v-on 配合 emit -->
    <Pagination v-bind:childPaginations="pagination" v-on:emitPagination="getProducts"></Pagination>

    <!--編輯、新增商品的 Modal -->
    <div
      class="modal fade"
      id="productsModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="image">輸入圖片網址</label>
                  <input
                    v-model="tempProduct.imageUrl"
                    type="text"
                    class="form-control"
                    id="image"
                    placeholder="請輸入圖片連結"
                  />
                </div>
                <div class="form-group">
                  <label for="customFile">
                    或 上傳圖片
                    <i class="fas fa-spinner fa-spin" v-if="status.fileUploading"></i>
                  </label>
                  <input
                    type="file"
                    id="customFile"
                    class="form-control"
                    ref="files"
                    @change="upload"
                  />
                </div>
                <img
                  img="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80"
                  class="img-fluid"
                  alt
                  :src="tempProduct.imageUrl"
                />
              </div>
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">標題</label>
                  <input
                    v-model="tempProduct.title"
                    type="text"
                    class="form-control"
                    id="title"
                    placeholder="請輸入標題"
                  />
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input
                      v-model="tempProduct.category"
                      type="text"
                      class="form-control"
                      id="category"
                      placeholder="請輸入分類"
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">單位</label>
                    <input
                      v-model="tempProduct.unit"
                      type="unit"
                      class="form-control"
                      id="unit"
                      placeholder="請輸入單位"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="origin_price">原價</label>
                    <input
                      v-model="tempProduct.origin_price"
                      type="number"
                      class="form-control"
                      id="origin_price"
                      placeholder="請輸入原價"
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input
                      v-model="tempProduct.price"
                      type="number"
                      class="form-control"
                      id="price"
                      placeholder="請輸入售價"
                    />
                  </div>
                </div>
                <hr />

                <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea
                    v-model="tempProduct.description"
                    type="text"
                    class="form-control"
                    id="description"
                    placeholder="請輸入產品描述"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea
                    v-model="tempProduct.content"
                    type="text"
                    class="form-control"
                    id="content"
                    placeholder="請輸入產品說明內容"
                  ></textarea>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <!-- 0= 暫停使用， 1 = 啟用 -->
                    <input
                      v-model="tempProduct.is_enabled"
                      class="form-check-input"
                      type="checkbox"
                      id="is_enabled"
                      :false-value="0"
                      :true-value="1"
                    />
                    <label class="form-check-label" for="is_enabled">是否啟用</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="updataProduct">確認</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 刪除 商品的 Modal -->
    <div
      class="modal fade"
      id="delProductModal"
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
            <strong class="text-danger">{{tempProduct.title}}</strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="deleteProducts">確認刪除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 
<script>
// jQ 不建議用全局註冊
import $ from "jquery";
import Pagination from "../Pagination";

export default {
  data() {
    return {
      // 用來儲存遠端資料
      products: [],
      //用來儲存本地 modal 中 input 資料
      tempProduct: {},
      pagination: {},
      isNew: false,
      //load 專用變數， true 時會是
      isLoading: false,
      // 分成局部 loading 圖示、全域 load 圖示
      status: {
        fileUploading: false
      }
    };
  },
  methods: {
    // 獲得遠端資料，透過 creat 鉤子觸發
    // 參數預設值，若參數沒有值就使用 1，就是預設開啟後，會在第一頁，這邊 page 主要是交給 api 中網址的變數
    getProducts(page = 1) {
      const api = `${process.env.APIPATH}api/${process.env.CUSTOMPATH}/admin/products?page=${page}`;
      const vm = this;
      //api 讀取時跑出 loading 圖片，api 讀取完畢不顯示
      vm.isLoading = true;
      // 使用 axios 獲得遠端資料，將資料放置於本地端的 products 陣列
      this.$http.get(api).then(response => {
        console.log(response.data);
        vm.products = response.data.products;
        vm.isLoading = false;
        vm.pagination = response.data.pagination;
      });
      
    },
    // 新增產品、修改產品的確任鍵
    updataProduct() {
      let api = `${process.env.APIPATH}api/${process.env.CUSTOMPATH}/admin/product`;
      const vm = this;
      let httpMeth = "post";
      //  如果不是新增(編輯)
      if (!vm.isNew) {
        api = `${process.env.APIPATH}api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;
        httpMeth = "put";
      }
      //新增、修改需要不同的 axios 動作，所以使用 [httpMeth] 變數觸發不同事件
      // api 規定要使用 { data:資料本身} 的方式才能讀取
      this.$http[httpMeth](api, { data: vm.tempProduct }).then(response => {
        if (response.data.success) {
          $("#productsModal").modal("hide");
          vm.getProducts();
        } else {
          $("#productsModal").modal("hide");
          vm.getProducts();
          console.log("新增失敗");
        }
      });
    },
    // 編輯、新增產品觸發。兩者介面類似，所有使用相同方法，透過參數確認是編輯 or 新增
    openModel(isNew, item) {
      if (isNew) {
        //如果是新增商品，因為是新頁面 input 自然是空的，所以使用空陣列
        this.tempProduct = {};
        // 也修改 原生 isNew 狀態， updataProduct 會使用到
        this.isNew = true;
      } else {
        // 如果是編輯 tempProducts = item(商品資料)
        this.tempProduct = Object.assign({}, item); //編輯商品需要跑出商品原來的設定，所以賦予 的屬性
        this.isNew = false;
        console.log("編輯");
      }
      // BS 設定的 jQ 方法，會開啟 modal
      $("#productsModal").modal("show");
    },
    // products 點擊刪除 button 執行的 function
    openDelModal(item) {
      this.tempProduct = Object.assign({}, item);
      $("#delProductModal").modal("show");
    },
    // 確認刪除 button 執行
    deleteProducts() {
      const vm = this;
      const api = `${process.env.APIPATH}api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;
      this.$http.delete(api).then(response => {
        console.log(response.data);
        if (response.data.success) {
          vm.getProducts();
          $("#delProductModal").modal("hide");
        } else {
          vm.getProducts();
          console.log("刪除失敗");
          $("#delProductModal").modal("hide");
        }
      });
    },

    // 上傳圖片的方法
    upload() {
      console.log(this); //是 upload 元件，$refs.files.files 會是陣列，檔案中第 1 個會是剛剛上傳的圖片網址
      const uploadedFile = this.$refs.files.files[0];
      const vm = this;
      const formData = new FormData(); //要上傳檔案時，跟一般使用 ajax 不同，會使用 new FormData
      formData.append("file-to-upload", uploadedFile); //append() 是 FormData() 特有的方法，功能是將指定的 form data 欄位新增
      const url = `${process.env.APIPATH}api/${process.env.CUSTOMPATH}/admin/upload`;
      vm.status.fileUploading = true;
      //axios 的 Post 參數分別是 (api 網址 , 傳送資料, 傳送設定)
      this.$http
        .post(url, formData, {
          headers: {
            //要傳送的資料類型，這邊的是 form data類型
            "Content-Type": "multipart/form-data"
          }
        })
        .then(response => {
          console.log(response.data); //imageUrl
          // 上傳圖片成功
          if (response.data.success) {
            // 無法用賦值方法直接寫入，會沒有 set 、get
            // vm.tempProduct.imageUrl = response.data.imageUrl;
            // console.log(vm.tempProduct.imageUrl);
            //(加入地點,加入的屬性,加入的值)
            vm.$set(vm.tempProduct, "imageUrl", response.data.imageUrl);
            vm.status.fileUploading = false;
          } else {
            //$emit('呼叫方法',顯示訊息,'樣式')
            vm.$bus.$emit("message:push", response.data.message, "danger");
          }
        });
    }
  },
  components: {
    Pagination
  },
  // 生命週期鉤子，開啟網頁時觸發 getProducts
  created() {
    this.getProducts();
    this.$bus.$emit("message:push", "created 的訊息", "success");
  }
};
</script>