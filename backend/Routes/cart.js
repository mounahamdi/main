const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');
const isAdmin = require('../middleware/isAdmin');
const cartController = require('../Controllers/cartController.js');
const orderController= require('../Controllers/orderController.js')


router.post('/new', cartController.addToCart)
router.get('/:user_id', cartController.getCartItemsHandler)
router.delete('/', cartController.deleteCartItem)
router.post('/order', orderController.createOrder)

module.exports = router;