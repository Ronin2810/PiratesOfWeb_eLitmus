const mysql = require("mysql2")

module.exports = mysql.createConnection({
    host: 'db4free.net',
    user: 'ronin2810',
    password: 'ronin2810',
    database: 'ronin2810'
    // host: '0.0.0.0',
    // user: 'root',
    // password: '',
    // database: 'db2'
})
.on("connect", () => {
    console.log("DB connected");
})
.on("error", (err) => {
    console.log("DB not connected: ", err.message);
})