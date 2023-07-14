// 此檔案為users路由模組

// 載入Express與Express路由器
const express = require('express')
const router = express.Router()

// 載入User模組
const User = require('../../models/User')

// 引用passport
const passport = require('passport')

// 引用bcrypt
const bcrypt = require('bcryptjs')

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

// 登出功能
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已成功登出。')
  res.redirect('/users/login')
})

// 註冊頁面
router.get('/register', (req, res) => {
  res.render('register')
})

// 送出註冊表單
router.post('/register', (req, res) => {
  // 取得註冊表單參數
  const { name, email, password, confirmPassword } = req.body
  // 建立錯誤訊息
  const errors = []
  if (!email || !password || !confirmPassword) {
    errors.push({ message: '除了名字外，所有欄位都是必填！' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  // 檢查使用者是否已註冊
  User.findOne({ email })
    .then(user => {
      // 若已註冊，退回原本畫面，並顯示錯誤訊息
      if (user) {
        errors.push({ message: '這個 Email 已經註冊過！' })
        return res.render('register', {
          errors,
          name,
          email,
          password,
          confirmPassword
        })
      }
      // 若無，新增註冊資料
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({
          name,
          email,
          password: hash
        }))
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error, null))
})

// 匯出路由模組
module.exports = router
