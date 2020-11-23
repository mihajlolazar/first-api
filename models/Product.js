/**
 * Product model.
 * */
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  },
});

module.exports = mongoose.model('Product', ProductSchema);
