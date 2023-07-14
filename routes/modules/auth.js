// 此檔案為auth路由模組

// 引用Express與Express路由器
const express = require('express')
const router = express.Router()

// 引用passport
const passport = require('passport')

// 設定auth路由
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))

router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

// 匯出路由模組
module.exports = router
