// @ts-check
const mysql = require('mysql2/promise')
require('dotenv').config()

const { DB_HOST, DB_USER, DB_PWD, DB_NAME } = process.env

module.exports = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PWD,
  database: DB_NAME,
  connectTimeout: 5000,
})
