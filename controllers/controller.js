const { Profile, User } = require('../models/index')
const bcrypt = require('bcryptjs')

class Controller {

    static async renderHome(req, res) {
        try {
            res.render('homeBeforeLogin')
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async renderRegister(req, res) {
        try {
            res.render('register')
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async handleRegister(req, res) {
        try {
            const {username, name, password, phoneNumber, email, role} = req.body
            const user = await User.create({ username, password, role });
            await user.createProfile({name, phoneNumber, email, UserId: user.id})
            
            res.redirect('/login')
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async renderLogin(req, res) {
        try {
            const {error} = req.query
            res.render('login', {error})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async handleLogin(req, res) {
        try {
            const { username, password } = req.body
            const user = await User.findOne({ where: { username } })
            if (user) {
                const isValidPassword = await bcrypt.compare(password, user.password)

                if (isValidPassword) {
                    req.session.userId = user.id
                    res.redirect('/')
                } else {
                    const error = 'Incorrect Password'
                    res.redirect(`/login?error=${error}`)
                }
            } else {
                const error = 'Username not found!'
                res.redirect(`/login?error=${error}`)
            }
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

}

module.exports = Controller