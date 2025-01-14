const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const stockSchema = new Schema ({
  stock: { type: String, required: true, unique: true },
  likecount: { type: Number, default: 0 },
  address: { type: [String], default: [] }
});

module.exports.Stock = mongoose.model('stock', stockSchema);