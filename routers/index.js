const express = require('express');
const Controller = require('../controllers/controller');
const router = express.Router();

router.get('/', Controller.renderHome);
router.get('/register', Controller.renderRegister);
router.post('/register', Controller.handleRegister);
router.get('/login', Controller.renderLogin);
router.post('/login', Controller.handleLogin);

router.use(function (req, res, next) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    next();
  }
});

const buyer = function (req, res, next) {
    if (req.session.user.role == 'Buyer') {
        next()
    }
};

const seller = function (req, res, next) {
    if (req.session.user.role == 'Seller') {
        next()
    }
}

const admin = function (req, res, next) {
  if (req.session.user.role == 'Admin') {
    next()
  }
}



router.get('/home-buyer', buyer, Controller.renderHomeBuyer);
router.get('/home-seller', seller, Controller.renderHomeSeller)

router.get('/seller/add/product', seller, Controller.renderAddProduct)
router.post('/seller/add/product', seller, Controller.handleAddProduct)

router.get('/admin', admin, Controller.renderAdmin);
router.get('/admin/:UserId/delete', admin, Controller.handelDelete);

router.get('/seller/:productId', buyer, Controller.renderProductDetail)
router.get('/seller/:productId/buy', buyer, Controller.handleBuyProduct)

router.get('/seller/:sellerId')

router.get('/logout', Controller.handleLogout)



module.exports = router;
