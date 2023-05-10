const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');
const isAdmin = require('../middleware/isAdmin');
const productController = require('../Controllers/productController.js');

// Create a new product
router.post('/new', productController.createProduct);

// // Get all products
 router.get('/', productController.getAllProducts);

// // Get a single product by ID
router.get('/:product_id',productController.getProduct);

// // Update a product by ID
router.put('/:product_id', productController.updateProduct);

// // Delete a product by ID
 router.delete('/:product_id', productController.deleteProduct);

module.exports = router;
