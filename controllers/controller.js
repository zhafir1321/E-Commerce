const { USE } = require("sequelize/lib/index-hints");
const { Profile, User } = require("../models/index");
const bcrypt = require("bcryptjs");
const { where } = require("sequelize");

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
      const { username, name, password, phoneNumber, email, role } = req.body;
      const user = await User.create({ username, password, role });
      await user.createProfile({ name, phoneNumber, email, UserId: user.id });

      res.redirect("/login");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async renderLogin(req, res) {
    try {
      const { error } = req.query;
      res.render("login", { error });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async handleLogin(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ where: { username } });
      if (user) {
        const isValidPassword = await bcrypt.compare(password, user.password);

                if (isValidPassword) {
                    req.session.user = {
                        username: user.username,
                        role: user.role
                    }
                    
                    if (req.session.user.role === 'Buyer') {
                        res.redirect('/home')
                    } 
                    if (req.session.user.role === 'Seller') {
                        res.redirect('/home-seller')
                    }
                    
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

    static async renderHomeSeller(req, res) {
        try {
            res.render('home')
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

}

module.exports = Controller
        if (isValidPassword) {
          res.redirect("/");
        } else {
          const error = "Incorrect Password";
          res.redirect(`/login?error=${error}`);
        }
      } else {
        const error = "Username not found!";
        res.redirect(`/login?error=${error}`);
      }
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async renderAdmin(req, res) {
    try {
      let data = await Profile.findAll({
        include: User,
      });
      // res.send(data)
      res.render("admin", { data });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async handelDelete(req, res) {
    try {
      let { UserId } = req.params;

      await Profile.destroy({
        where: {
          id: UserId,
        },
      });

      await User.destroy({
        where: {
          id: UserId,
        },
      });

      res.redirect("/admin");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
}

module.exports = Controller;
