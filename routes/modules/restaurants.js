// 此檔案為restaurants路由模組

// 載入Express與Express路由器
const express = require('express')
const router = express.Router()

// 載入Restaurant model
const Restaurant = require('../../models/Restaurant')

// 定義restaurants路由
// 使用者可以新增一家餐廳
router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', (req, res) => {
  const userId = req.user._id
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  return Restaurant.create({ name, name_en, category, image, location, phone, google_map, rating, description, userId })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 使用者可以依餐廳名稱或類別搜尋特定餐廳
router.get('/search', (req, res) => {
  const userId = req.user._id
  const keyword = req.query.keyword
  Restaurant.find({ userId })
    .lean()
    .sort({ _id: 'asc' })
    .then(restaurants => {
      const searchResults = restaurants.filter(restaurants => restaurants.name.toLowerCase().includes(keyword.toLowerCase()) || restaurants.category.includes(keyword))
      res.render('index', { restaurants: searchResults, keyword })
    })
    .catch(error => console.log(error))
})

// 使用者可以瀏覽一家餐廳的詳細資訊
router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

// 使用者可以編輯一家餐廳的詳細資訊
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  return Restaurant.findOne({ _id, userId })
    .then(restaurant => {
      restaurant.name = name
      restaurant.name_en = name_en
      restaurant.category = category
      restaurant.image = image
      restaurant.location = location
      restaurant.phone = phone
      restaurant.google_map = google_map
      restaurant.rating = rating
      restaurant.description = description
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(error => console.log(error))
})

// 使用者可以刪除一家餐廳
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 匯出router模組
module.exports = router