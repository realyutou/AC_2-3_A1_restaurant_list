// 此檔案為users路由模組

// 載入Express與Express路由器
const express = require('express')
const router = express.Router()

// 載入User模組
const User = require('../../models/User')

// 引用passport
const passport = require('passport')

// 定義users路由
// 登入頁面
router.get('/login', (req, res) => {
  res.render('login')
})

// 送出登入表單
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

// 註冊頁面
router.get('/register', (req, res) => {
  res.render('register')
})

// 送出註冊表單
router.post('/register', (req, res) => {
  // 取得註冊表單參數
  const { name, email, password, confirmPassword } = req.body
  // 檢查使用者是否已註冊
  User.findOne({ email })
    .then(user => {
      // 若已註冊，退回原本畫面
      if (user) {
        console.log('User already exists.')
        return res.render('register', {
          name,
          email,
          password,
          confirmPassword
        })
      }
      // 若無，新增註冊資料
      return User.create({
        name,
        email,
        password
      })
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error, null))
})

// 匯出路由模組
module.exports = router