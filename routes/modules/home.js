// 此檔案為home路由模組

// 引用Express與Express路由器
const express = require('express')
const router = express.Router()

// 引用Restaurant model
const Restaurant = require('../../models/Restaurant')

// 定義首頁路由
// 使用者可以瀏覽全部所有餐廳
router.get('/', (req, res) => {
  const userId = req.user._id
  Restaurant.find({ userId }) // 找出Restaurant model裡的所有資料
    .lean() // 把Mongoose的Model物件轉換成乾淨的Javascript資料陣列
    .sort({ _id: 'asc' }) // 根據_id升冪排列，降冪排列為'desc'
    .then(restaurants => res.render('index', { restaurants })) // 將資料傳給index樣板
    .catch(error => console.log(error))
})

module.exports = router
