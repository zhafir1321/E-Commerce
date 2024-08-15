const {Profile, User} = require('../models/index')

class Controller {

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
            const {name, password, phone, email, role} = req.body
            console.log(req.body);
            const user = await User.create({ name, password, phone, email, role });
            await user.createProfile({})
            
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

}

module.exports = Controller