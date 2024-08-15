const express = require('express')
const Controller = require('../controllers/controller')
const router = express.Router()


router.get('/', Controller.renderHome)
router.get('/register', Controller.renderRegister);
router.post('/register', Controller.handleRegister);
router.get('/login', Controller.renderLogin);
router.post('/login', Controller.handleLogin);

router.use(function (req, res, next) {
    if (!req.session.userId) {
        res.redirect('/login')
    } else {
        next()
    }
}) 

module.exports = router