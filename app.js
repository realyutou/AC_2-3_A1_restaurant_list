// Include packages and define server related variables
const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const routes = require('./routes')
require('./config/mongoose')

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