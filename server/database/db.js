const mysql = require('mysql')

// connecting database
const Connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"bbms"
})

module.exports = {Connection};