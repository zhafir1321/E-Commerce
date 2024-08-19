const express = require('express')
const app = express()
const router = require('./routers/index')
const session = require('express-session')
const multer = require('multer')
const sequelize = require('./models/index').sequelize

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))


app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))

app.use('/images', express.static('images'));





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

// sequelize
//   .sync({ alter: true })
//   .then(() => {
//     app.listen(3000, () => {
//       console.log(`Server is running on port`);
//     });
//   })
//   .catch((error) => {
//     console.error(error);
//   });