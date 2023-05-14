const express = require("express")
const app = express()
const path = require("path")
const ejs = require("ejs")
const session = require("express-session")

app.use(session({
    secret: 'aditya',
    saveUninitialized: false,
    resave: false,
    cookie: {
        sameSite: 'strict'
    }
}))


const admin_router = require("./routes/admin_router")
const player_router = require("./routes/player_router")
const app_router = require("./routes/app_router")

const static_path = path.join(__dirname, "static")
app.use(express.static(static_path))

const views_path = path.join(__dirname, "views")
app.set("view engine", "ejs")
app.set("views", views_path)


app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(player_router)
app.use(admin_router)
app.use(app_router)

app.listen(5555, () => {
    console.log("Server listening on port 5555... http://localhost:5555");
})