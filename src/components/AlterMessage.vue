<template>
  <div class="message-alert">
    <div
      class="alert alert-dismissible"
      :class="'alert-' + item.status"
      v-for="(item, i) in messages"
      :key="i"
    >
      {{ item.message }}
      <button
        type="button"
        class="close"
        @click="removeMessage(i)"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      // 該元件需要使用三個變數，在此手動寫入的訊息不會自動移除
      messages: [
        // {
        //     //文字內容
        //     message: "測試訊息",
        //     //樣式，追隨 Bootstrap
        //     status: "danger",
        //     //類似 id 辨別的
        //     timestamp: 123,
        // }
      ]
    };
  },
  methods: {
    //  啟動的該提示的函式，最後方會執行移除該提示的函式
    //手動增加的訊息需要自己案 xx 才會消失，若由外部呼叫的 alter 5 秒後會消失
    updateMessage(message, status) {
      const timestamp = Math.floor(new Date() / 1000);
      this.messages.push({
        message,
        status,
        timestamp
      });
      this.removeMessageWithTiming(timestamp);
    },
    removeMessage(num) {
      this.messages.splice(num, 1);
    },
    // 5秒到了自動移除
    removeMessageWithTiming(timestamp) {
      const vm = this;
      setTimeout(() => {
        vm.messages.forEach((item, i) => {
          if (item.timestamp === timestamp) {
            vm.messages.splice(i, 1);
          }
        });
      }, 5000);
    }
  },
  created() {
    const vm = this;
    // 自定義名稱 'messsage:push'
    // message: 傳入參數
    // status: 樣式，預設值為 warning ，參考 BS
    vm.$bus.$on("message:push", (message, status = "warning") => {
      // message:push 執行時，也會執行 updateMessage(5 秒後刪除) 這個方法
      vm.updateMessage(message, status);
    });
    vm.$bus.$on("error:push", (message, status = "warning") => {
      // message:push 執行時，也會執行 updateMessage 這個方法
      vm.updateMessage(message, status);
    });
    // vm.$bus.$emit("message:push");
  }
};
</script>

<style scope>
.message-alert {
  position: fixed;
  max-width: 50%;
  top: 56px;
  right: 20px;
  z-index: 1100;
}
</style>