const express = require('express')
const Controller = require('./controllers/controller')
const app = express()

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))

app.get('/register', Controller.renderRegister)
app.post('/register', Controller.handleRegister)
app.get('/login', Controller.renderLogin)
app.post('/login', Controller.handleLogin)

app.listen(3000, () => {
    console.log(`SERVER CONNECTED`);
})