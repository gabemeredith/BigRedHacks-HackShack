const mongoose = require('mongoose')

const { Schema } = mongoose;

const VideoSchema = new Schema({
  business: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
  url: { type: String, required: true },  // TikTok/YouTube/Cloudinary link
  caption: String,
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Video', VideoSchema);