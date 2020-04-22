export default function(time){
    const date = new Date(time * 1000);
    return date.toLocaleDateString(); 
  }
  //寫好 filter 的方法後，還要再 main.js 做環境設定才能使用