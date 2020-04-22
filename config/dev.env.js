'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  // 除了字串方式插入，還需要一個雙引號
  NODE_ENV: '"development"',
  // 網址
  APIPATH: '"https://vue-course-api.hexschool.io/"',
  // 我們申請路徑
  CUSTOMPATH: '"ryder123"', 
})
