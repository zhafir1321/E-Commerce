
const { Profile, User, Product, Category } = require('../models/index')
const bcrypt = require('bcryptjs')



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
                        userId: user.id,
                        username: user.username,
                        role: user.role
                    }
                    
                    if (req.session.user.role === 'Buyer') {
                        res.redirect('/home-buyer')
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

    static async renderHomeBuyer(req, res) {
        try {
            const { CategoryId } = req.query
            let options = {
                include: Category
            }
            if (CategoryId) {
                options.where = {
                    CategoryId
                }
            }
            const data = await Product.findAll(options)
            const category = await Category.findAll()
            
            res.render('home', {data, category})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async renderHomeSeller(req, res) {
        try {
            res.render('sellerHome')
        } catch (error) {
            console.log(error);
            res.render(error)
        }
    }

    static async renderAddProduct(req, res) {
        try {
            const data = await Category.findAll()
            
            res.render('sellerAddProduct', {data})
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async handleAddProduct(req, res) {
        try {
            
            console.log(req.body);
            console.log(req.session);
            
            const { name, price, description, CategoryId } = req.body
            
            const {path} = req.file
            const { userId } = req.session.user
            await Product.create({ name, price, description, SellerId: userId, image: path, CategoryId });

            
            
            
        } catch (error) {
            console.log(error);
            res.send(error)
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
