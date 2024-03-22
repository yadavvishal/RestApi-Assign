const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
// simpley run mongosh in terminal 
// automatic connect with mongodb

mongoose.connect('mongodb://localhost:27017/restaurant_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Models
const Product = mongoose.model('Product', {
  name: String,
  price: Number,
});

const Order = mongoose.model('Order', {
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  quantity: Number,
});

// Routes
// CRUD operations for products
app.post('/products', async (req, res) => {
  try {
    const { name, price } = req.body;
    const product = new Product({ name, price });
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, price } = req.body;
    await Product.findByIdAndUpdate(productId, { name, price });
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    await Product.findByIdAndDelete(productId);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Place an order
app.post('/orders', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const order = new Order({ product: productId, quantity });
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List all orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
