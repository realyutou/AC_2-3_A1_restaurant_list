// 引用Express及Express路由器
const express = require('express')
const router = express.Router()

// 引入home模組程式碼
const home = require('./modules/home')

// 引入restaurants模組程式碼
const restaurants = require('./modules/restaurants')

// 引入users模組程式碼
const users = require('./modules/users')

// 引用auth模組程式碼
const auth = require('./modules/auth')

// 引入middleware(驗證使用者是否登入)
const { authenticator } = require('../middleware/auth')

// 將網址結構符合'/restaurants'字串的request導向restaurants模組
router.use('/restaurants', authenticator, restaurants)

// 將網址結構符合'/users'字串的request導向users模組
router.use('/users', users)

// 將網址結構符合'/auth'字串的request導向auth模組
router.use('/auth', auth)

// 將網址結構符合'/'字串的request導向home模組
router.use('/', authenticator, home)

// 匯出路由器
module.exports = router