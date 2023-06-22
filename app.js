// Include packages and define server related variables
const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
// const restaurantList = require('./restaurant.json')
const mongoose = require('mongoose')
const Restaurant = require('./models/Restaurant')

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

// Set static files
app.use(express.static('public'))

// Set routes
app.get('/', (req, res) => {
  // res.render('index', { restaurants: restaurantList.results})
  Restaurant.find() // 找出Restaurant model裡的所有資料
    .lean() // 把Mongoose的Model物件轉換成乾淨的Javascript資料陣列
    .sort({ _id: 'asc' }) // 根據_id升冪排列，降冪排列為'desc'
    .then(restaurants => res.render('index', { restaurants: restaurants })) // 將資料傳給index樣板
    .catch(error => console.log(error))
})

app.get('/restaurants/:id', (req, res) => {
  // const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.id)
  // res.render('show', { restaurant: restaurant})
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant: restaurant }))
    .catch(error => console.log(error))
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  // const restaurants = restaurantList.results.filter(restaurants => restaurants.name.toLowerCase().includes(keyword.toLowerCase()) || restaurants.category.includes(keyword))
  // res.render('index', { restaurants: restaurants, keyword: keyword })
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