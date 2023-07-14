// Include packages and define server related variables
const Restaurant = require('../Restaurant')
const User = require('../User')
const restaurantList = require('../../restaurant.json').results
const bcrypt = require('bcryptjs')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
} // Require dotenv only in non-production environment

const db = require('../../config/mongoose')

const userList = [
  {
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678'
  },
  {
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678'
  }
]

db.once('open', () => {
  for (let i = 0; i < userList.length; i++) {
    bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(userList[i].password, salt))
      .then(hash => (User.create({
        name: userList[i].name,
        email: userList[i].email,
        password: hash
      })))
      .then(user => {
        const userId = user._id
        for (let i = 0; i < 3; i++) {
          restaurantList[0].userId = userId
          Restaurant.create(restaurantList[0])
          restaurantList.shift()
          // user1擁有餐廳123，user2擁有餐廳456，故將第一筆資料存入資料庫伺服器後便將其由陣列中移除，重複三次，即可滿足條件
        }
      })
      .catch(error => console.log(error))
    console.log(`${userList[i].name} is done.`)
  }
})