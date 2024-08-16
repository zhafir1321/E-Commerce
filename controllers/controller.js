const { Profile, User, Product, Category } = require('../models/index');
const bcrypt = require('bcryptjs');

class Controller {
  static async renderHome(req, res) {
    try {
      res.render('homeBeforeLogin');
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async renderRegister(req, res) {
    try {
      const {errors} = req.query
      res.render('register', {errors});
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async handleRegister(req, res) {
    try {
      const { username, name, password, phoneNumber, email, role } = req.body;
      const user = await User.create({ username, password, role });
      await user.createProfile({ name, phoneNumber, email, UserId: user.id });

      res.redirect('/login');
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map((e) => e.message).join('. ');
        res.redirect(`/register?errors=${errors}`)
      } else {
        res.send(error)
      }
    }
  }

  static async renderLogin(req, res) {
    try {
      const { error } = req.query;
      res.render('login', { error });
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
            role: user.role,
          };

          if (req.session.user.role === 'Buyer') {
            res.redirect('/home-buyer');
          }
          if (req.session.user.role === 'Seller') {
            res.redirect('/home-seller');
          }
          if (req.session.user.role == 'Admin') {
            res.redirect('/admin');
          }
        } else {
          const error = 'Incorrect Password';
          res.redirect(`/login?error=${error}`);
        }
      } else {
        const error = 'Username not found!';
        res.redirect(`/login?error=${error}`);
      }
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async renderHomeBuyer(req, res) {
    try {
      const { role } = req.session.user
      const { search } = req.query;
      const data = await Product.searchProduct(search)
      const category = await Category.findAll();

      res.render('home', { data, category, role });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async renderHomeSeller(req, res) {
    try {
      const data = await Product.findAll({include: Category})
      res.render('sellerHome', {data});
    } catch (error) {
      console.log(error);
      res.render(error);
    }
  }

  static async renderAddProduct(req, res) {
    try {
      const {role} = req.session.user
      
      const {errors} = req.query
      const data = await Category.findAll();

      res.render('sellerAddProduct', { data, errors, role });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async handleAddProduct(req, res) {
    try {
      const { name, price, description, CategoryId } = req.body;

      const { path } = req.file;
      const { userId } = req.session.user;
      await Product.create({
        name,
        price,
        description,
        SellerId: userId,
        image: path,
        CategoryId,
      });
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map((e) => e.message).join('. ');
        res.redirect(`/seller/add/product?errors=${errors}`);
      } else {
        res.send(error);
      }
    }
  }

  static async renderAdmin(req, res) {
    try {
      const {username, name} = req.query
      let data = await Profile.findAll({
        include: User,
      });
      res.render('admin', { data, username, name });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async handelDelete(req, res) {
    try {
      let { UserId } = req.params;
      const data = await User.findOne({ where: { id: UserId } })
      const name = await Profile.findOne({where: { UserId}})

      await User.destroy({
        where: { id: UserId },
      });

      res.redirect(`/admin?username=${data.username}&name=${name.name}`);
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async renderProductDetail(req, res) {
    try {
      const { buy } = req.query;
      const { productId } = req.params;
      const data = await Product.findOne({
        where: { id: productId },
        include: Category,
      });
      res.render('productDetail', { data, buy });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async handleBuyProduct(req, res) {
    try {
      const { productId } = req.params;
      const { userId } = req.session.user;
      await Product.update({ BuyerId: userId }, { where: { id: productId } });
      res.redirect(`/seller/${productId}?buy=successful`);
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async handleLogout(req, res) {
    try {
      if (req.session.user) {
          req.session.destroy((err) => {
            if (err) {
              return res.status(500).send('Unable to log out');
            }
            res.redirect('/login');
          });
      }
    } catch (error) {
      console.log(error);
      res.send(error)
    }
  }

  static async renderProfile(req, res) {
    try {
      const { sellerId } = req.params
      const data = await Product.findAll({ where: { SellerId: sellerId } })
      res.render('profile', {data})
    } catch (error) {
      console.log(error);
      res.send(error)
    }
  }
}

module.exports = Controller;
