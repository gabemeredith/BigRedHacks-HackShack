const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  business: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Business', 
    required: [true, 'Business reference is required'] 
  },
  url: { 
    type: String, 
    required: [true, 'Video URL is required'],
    trim: true
  },
  title: {
    type: String,
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  caption: {
    type: String,
    trim: true,
    maxlength: [500, 'Caption cannot exceed 500 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  thumbnailUrl: {
    type: String,
    trim: true
  },
  duration: {
    type: Number // Duration in seconds
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { 
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      // Add computed fields if needed
      return ret;
    }
  }
});

// Indexes
VideoSchema.index({ business: 1 });
VideoSchema.index({ createdAt: -1 });
VideoSchema.index({ tags: 1 });
VideoSchema.index({ isActive: 1 });

// Pre-save middleware
VideoSchema.pre('save', function(next) {
  // Generate thumbnail URL if not provided (basic implementation)
  if (!this.thumbnailUrl && this.url) {
    // For YouTube videos
    if (this.url.includes('youtube.com') || this.url.includes('youtu.be')) {
      const videoId = this.extractYouTubeId(this.url);
      if (videoId) {
        this.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }
    // For TikTok videos (placeholder)
    else if (this.url.includes('tiktok.com')) {
      this.thumbnailUrl = '/placeholder-tiktok-thumbnail.jpg';
    }
  }
  next();
});

// Helper method to extract YouTube video ID
VideoSchema.methods.extractYouTubeId = function(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Virtual for engagement rate
VideoSchema.virtual('engagementRate').get(function() {
  if (this.views === 0) return 0;
  return Math.round((this.likes / this.views) * 100 * 100) / 100; // Percentage with 2 decimals
});

module.exports = mongoose.model('Video', VideoSchema);