const Product = require('../ORM/product.model.js');

async function createProduct(req, res) {
  try {
    const { product_name, description, price, stock, image } = req.body;

    // Validate input
    if (!product_name || !description || !price || !stock || !image) {
      return res.status(400).json({ message: 'Please provide product_name, description, price, stock, and image' });
    }

    if (typeof product_name !== 'string' || typeof description !== 'string' || typeof image !== 'string') {
      return res.status(400).json({ message: 'product_name, description, and image must be strings' });
    }

    if (typeof price !== 'number' || isNaN(price)) {
      return res.status(400).json({ message: 'Price must be a valid number' });
    }

    if (typeof stock !== 'number' || isNaN(stock)) {
      return res.status(400).json({ message: 'Stock must be a valid number' });
    }

    // Create new product
    const newProduct = await Product.create({ product_name, description, price, stock, image });

    // Send response with new product
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getAllProducts(req, res) {
    try {
      // Fetch all products from the database
      const products = await Product.findAll();
  
      // Send response with all products
      res.status(200).json({ products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

// get one single product by ID 
  async function getProduct(req, res) {
    try {
      const { product_id } = req.params;
      // Find the product by ID
      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      // Send response with the product
      res.status(200).json({ product });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }


// Update an existing product by ID 
  async function updateProduct(req, res) {
    try {
      const { product_id } = req.params;
      const { product_name, description, price, stock, image, category } = req.body;
        
      // Check if product exists
      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Validate input
      if ((!product_name || typeof product_name !== 'string') &&
          (!description || typeof description !== 'string') &&
          (price === undefined || isNaN(price)) &&
          (stock === undefined || isNaN(stock)) &&
          (!image || typeof image !== 'string') &&
          (!category || typeof category !== 'string')) {
        return res.status(400).json({ message: 'Please provide at least one valid field to update' });
      }
  
      if (price !== undefined && (typeof price !== 'number' || isNaN(price))) {
        return res.status(400).json({ message: 'Price must be a valid number' });
      }
  
      if (stock !== undefined && (typeof stock !== 'number' || isNaN(stock))) {
        return res.status(400).json({ message: 'Stock must be a valid number' });
      }
  
      // Update product
      product.product_name = product_name || product.product_name;
      product.description = description || product.description;
      product.price = price === undefined ? product.price : price;
      product.stock = stock === undefined ? product.stock : stock;
      product.image = image || product.image;
      product.category = category || product.category;
      product.updated_at = new Date();
  
      await product.save();
  
      res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  

// Delete a product : 
  async function deleteProduct(req, res) {
    try {
      const { product_id } = req.params;
  
      // Check if product exists
      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Delete product
      await product.destroy();
  
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  

module.exports = {
  createProduct, getAllProducts, updateProduct, deleteProduct, getProduct
};
