// Include packages and define server related variables
const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const Restaurant = require('./models/Restaurant')
const methodOverride = require('method-override')

// Require dotenv only in non-production environment
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// Set MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// Access MongoDB connecting situation
const db = mongoose.connection

db.on('error', () => {
  console.log('MongoDB error!')
})

db.once('open', () => {
  console.log('MongoDB connected!')
})

// Set templates engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Set body-parser
app.use(express.urlencoded({ extended: true }))

// Set static files
app.use(express.static('public'))

// 設定每筆請求都會透過method-override進行前置處理
app.use(methodOverride('_method'))

// Set routes
// 使用者可以瀏覽全部所有餐廳
app.get('/', (req, res) => {
  Restaurant.find() // 找出Restaurant model裡的所有資料
    .lean() // 把Mongoose的Model物件轉換成乾淨的Javascript資料陣列
    .sort({ _id: 'asc' }) // 根據_id升冪排列，降冪排列為'desc'
    .then(restaurants => res.render('index', { restaurants: restaurants })) // 將資料傳給index樣板
    .catch(error => console.log(error))
})

// 使用者可以新增一家餐廳
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

app.post('/restaurants', (req, res) => {
  const newRestaurant = req.body
  return Restaurant.create(newRestaurant)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 使用者可以瀏覽一家餐廳的詳細資訊
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant: restaurant }))
    .catch(error => console.log(error))
})

// 使用者可以編輯一家餐廳的詳細資訊
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant: restaurant }))
    .catch(error => console.log(error))
})

app.put('/restaurants/:id', (req, res) => {
  const id = req.params.id
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  return Restaurant.findById(id)
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
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

// 使用者可以刪除一家餐廳
app.delete('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 使用者可以依餐廳名稱或類別搜尋特定餐廳
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  Restaurant.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(restaurants => {
      const searchResults = restaurants.filter(restaurants => restaurants.name.toLowerCase().includes(keyword.toLowerCase()) || restaurants.category.includes(keyword))
      res.render('index', { restaurants: searchResults, keyword: keyword })
    })
    .catch(error => console.log(error))
})

// Start and listen the server
app.listen(port, () => {
  console.log(`The server is running on http://localhost:${port}`)
})