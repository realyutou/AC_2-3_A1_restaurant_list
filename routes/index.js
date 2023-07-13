// 引用Express及Express路由器
const express = require('express')
const router = express.Router()

// 引入home模組程式碼
const home = require('./modules/home')

// 引入restaurants模組程式碼
const restaurants = require('./modules/restaurants')

// 引入users模組程式碼
const users = require('./modules/users')

// 將網址結構符合'/'字串的request導向home模組
router.use('/', home)

// 將網址結構符合'/restaurants'字串的request導向restaurants模組
router.use('/restaurants', restaurants)

// 將網址結構符合'/users'字串的request導向users模組
router.use('/users', users)

// 匯出路由器
module.exports = router