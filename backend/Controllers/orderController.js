const Order = require('../ORM/order.model.js');
const User = require('../ORM/user.model.js');
const Cart = require('../ORM/cart.model.js');
const Product = require('../ORM/product.model.js');

// create order
async function createOrder(req, res) {
    const user_id = req.body.user_id;
  
    try {
      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const cartItems = await Cart.findAll({
        where: {
          user_id: user_id,
        },
        include: Product,
      });
  
      if (cartItems.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }
  
      let totalAmount = 0;
      const orderItems = [];
  
      for (const cartItem of cartItems) {
        const product = cartItem.product;
        const quantity = cartItem.quantity;
        const price = product.price;
        const amount = price * quantity;
        totalAmount += amount;
  
        orderItems.push({
          product_id: product.product_id,
          quantity: quantity,
          price: price,
          amount: amount,
        });
        
        // reduce the product stock
        await product.update({ stock: product.stock - quantity });
      }
      
      // update missing fields in the user table
      await user.update({
        phone: req.body.phone || user.phone || '',
        address: req.body.address || user.address || '',
        city: req.body.city || user.city || '',
        state: req.body.state || user.state || '',
        zip_code: req.body.zip_code || user.zip_code || '',
        country: req.body.country || user.country || '',
      });
     
      // create the order
      const orderData = {
        user_id: user_id,
        total_amount: totalAmount,
        status: 'Pending',
        shipping_address: req.body.address,
        shipping_city: req.body.city,
        shipping_state: req.body.state,
        shipping_zip_code: req.body.zip_code,
        shipping_country: req.body.country,
        order_items: orderItems,
      };
  
      if (!req.body.order_date) {
        orderData.order_date = new Date();
      }
      console.log(orderData)
      const order = await Order.create(orderData);
  
      // clear the cart
      await Cart.destroy({
        where: {
          user_id: user_id,
        },
      });
  
      res.status(200).json({ message: 'Order created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }


  async function getOrdersByUserId(req, res) {
    const user_id = req.params.user_id;
  
    try {
      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const orders = await Order.findAll({
        where: {
          user_id: user_id,
        },
      });
  
      res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

module.exports = { createOrder, getOrdersByUserId };
