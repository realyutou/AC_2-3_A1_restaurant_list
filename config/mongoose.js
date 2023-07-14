// Include mongoose
const mongoose = require('mongoose')

// Require dotenv only in non-production environment
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// Set MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

// Access MongoDB connecting situation
const db = mongoose.connection

db.on('error', () => {
  console.log('MongoDB error!')
})

db.once('open', () => {
  console.log('MongoDB connected!')
})

//匯出mongoose模組
module.exports = db