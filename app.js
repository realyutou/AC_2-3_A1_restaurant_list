// Include packages and define server related variables
const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const routes = require('./routes')

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

// 將request導入路由器
app.use(routes)

// Start and listen the server
app.listen(port, () => {
  console.log(`The server is running on http://localhost:${port}`)
})