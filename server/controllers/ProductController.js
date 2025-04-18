// controllers/productController.js
const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, platform, genre, gameId } = req.body;

    if (!req.files?.image) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    // Upload to Cloudinary
    const imageFile = req.files.image;
    const result = await cloudinary.uploader.upload(imageFile.tempFilePath, {
      folder: 'akunff/products'
    });

    // Delete temp file
    fs.unlinkSync(imageFile.tempFilePath);

    // Validate required fields
    if (!title || !description || !price || !platform || !genre) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const product = new Product({
      title,
      description,
      price: parseFloat(price),
      platform,
      genre,
      gameId: gameId || undefined,
      image: {
        url: result.secure_url,
        publicId: result.public_id
      },
      user: req.user.id,
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { title, description, price, platform, genre, gameId } = req.body;
    const updateData = { title, description, platform, genre, gameId };

    if (price) {
      const priceValue = parseFloat(price);
      if (isNaN(priceValue) || priceValue <= 0) {
        return res.status(400).json({ message: 'Price must be a positive number' });
      }
      updateData.price = priceValue;
    }

    if (req.files?.image) {
      const imageFile = req.files.image;
      const currentProduct = await Product.findById(req.params.id);

      // Upload new image
      const result = await cloudinary.uploader.upload(imageFile.tempFilePath, {
        folder: 'akunff/products'
      });
      fs.unlinkSync(imageFile.tempFilePath);

      // Delete old image
      if (currentProduct.image.publicId) {
        await cloudinary.uploader.destroy(currentProduct.image.publicId);
      }

      updateData.image = {
        url: result.secure_url,
        publicId: result.public_id
      };
    }

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

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete image from Cloudinary
    if (product.image.publicId) {
      await cloudinary.uploader.destroy(product.image.publicId);
    }

    await product.deleteOne();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('user', '_id');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};