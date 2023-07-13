// 此檔案為users路由模組

// 載入Express與Express路由器
const express = require('express')
const router = express.Router()

// 定義users路由
// 登入頁面
router.get('/login', (req, res) => {
  res.render('login')
})

// 送出登入表單
router.post('/login', (req, res) => {
  
})

// 註冊頁面
router.get('/register', (req, res) => {
  res.render('register')
})

// 匯出路由模組
module.exports = router