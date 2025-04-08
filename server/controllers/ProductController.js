const Product = require('../models/Product');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, platform, genre, gameId } = req.body;

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }
    const image = `/uploads/${req.file.filename}`;

    // Validate required fields
    if (!title || !description || !price || !platform || !genre || !image) {
      return res.status(400).json({ message: 'All required fields (title, description, price, platform, genre, image) must be provided' });
    }

    // Validate price
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }

    // Create new product
    const product = new Product({
      title,
      description,
      price: priceValue,
      platform,
      genre,
      gameId: gameId || undefined,
      image,
      user: req.user.id,
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('user', 'name email');
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching product with ID: ${id}`);
    
    // Attempt to find the product by ID
    const product = await Product.findById(id).populate('user', 'name email');
    
    if (!product) {
      console.error(`Product with ID ${id} not found. Ensure the ID is correct and exists in the database.`);
      return res.status(404).json({ 
        message: 'Product not found', 
        details: `No product found with the provided ID: ${id}` 
      });
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.error(`Error fetching product with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  try {
    const { title, description, price, platform, genre, gameId } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

    // Validate price if provided
    let priceValue;
    if (price) {
      priceValue = parseFloat(price);
      if (isNaN(priceValue) || priceValue <= 0) {
        return res.status(400).json({ message: 'Price must be a positive number' });
      }
    }

    const updateData = {
      title,
      description,
      price: priceValue,
      platform,
      genre,
      gameId: gameId || undefined,
      image,
    };

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ message: 'Failed to update product', error: error.message });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};

module.exports = exports;