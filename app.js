const express = require('express')
const Controller = require('./controllers/controller')
const app = express()
const router = require('./routers/index')
const session = require('express-session')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))


app.get('/register', Controller.renderRegister)
app.post('/register', Controller.handleRegister)
app.get('/login', Controller.renderLogin)
app.post('/login', Controller.handleLogin)
app.get('/admin', Controller.renderAdmin)
app.get('/admin/:UserId/delete', Controller.handelDelete)
app.use(session({
    secret: 'r4h4si4',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        sameSite: true
    }
}))

app.use(router)

app.listen(3000, () => {
    console.log(`SERVER CONNECTED`);
})