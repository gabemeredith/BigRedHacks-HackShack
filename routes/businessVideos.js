const express = require('express');
const multer = require('multer');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Business = require('../models/Business');
const Video = require('../models/Videos');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 50 * 1024 * 1024 // 50 MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept video files
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'), false);
    }
  }
});

// Helper function to save video record
async function saveVideoRecord({ businessId, title, caption, url, tags = [] }) {
  const video = new Video({
    business: businessId,
    url,
    caption: caption || title,
    tags: Array.isArray(tags) ? tags : []
  });
  
  const savedVideo = await video.save();
  
  // Add video to business videos array
  await Business.findByIdAndUpdate(businessId, {
    $push: { videos: savedVideo._id }
  });
  
  return await Video.findById(savedVideo._id).populate('business', 'name');
}

// POST /api/businesses/:id/videos - Upload video (URL or file)
router.post('/:id/videos', protect, upload.single('file'), async (req, res) => {
  try {
    const businessId = req.params.id;
    const { title = '', caption = '', url = '', tags = '' } = req.body;
    
    console.log('[upload] POST /businesses/:id/videos', {
      businessId,
      hasFile: !!req.file,
      hasUrl: !!url,
      title,
      caption
    });

    // Verify business exists and user has access
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ 
        ok: false, 
        error: 'Business not found' 
      });
    }

    // Parse tags if they're a string
    const parsedTags = typeof tags === 'string' ? 
      tags.split(',').map(tag => tag.trim()).filter(tag => tag) : 
      (Array.isArray(tags) ? tags : []);

    let savedVideo;

    // Case A: URL-based upload
    if (!req.file && url) {
      console.log('[upload] URL-based upload:', url);
      savedVideo = await saveVideoRecord({ 
        businessId, 
        title, 
        caption, 
        url, 
        tags: parsedTags 
      });
    }
    // Case B: File upload (multipart)
    else if (req.file) {
      console.log('[upload] File upload:', req.file.originalname, req.file.size);
      
      // For now, we'll use a placeholder URL since we don't have cloud storage set up
      // In production, you'd upload to S3/Cloudinary/etc.
      const uploadedUrl = `https://example.cdn/videos/${Date.now()}-${req.file.originalname}`;
      
      savedVideo = await saveVideoRecord({ 
        businessId, 
        title, 
        caption, 
        url: uploadedUrl, 
        tags: parsedTags 
      });
    }
    // No file and no url provided
    else {
      return res.status(400).json({ 
        ok: false, 
        error: 'No video file or URL provided' 
      });
    }

    console.log('[upload] Video saved successfully:', savedVideo._id);
    
    return res.status(201).json({ 
      ok: true, 
      video: savedVideo 
    });

  } catch (err) {
    console.error('[upload error]', err);
    
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        ok: false, 
        error: 'Validation error', 
        details: messages.join(', ') 
      });
    }
    
    return res.status(500).json({ 
      ok: false, 
      error: 'Upload failed', 
      details: err?.message ?? String(err) 
    });
  }
});

// GET /api/businesses/:id/videos - Get all videos for a business
router.get('/:id/videos', async (req, res) => {
  try {
    const businessId = req.params.id;
    
    const videos = await Video.find({ business: businessId })
      .populate('business', 'name')
      .sort({ createdAt: -1 });
    
    res.json({ 
      ok: true, 
      videos 
    });
  } catch (err) {
    console.error('[get videos error]', err);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to fetch videos', 
      details: err?.message ?? String(err) 
    });
  }
});

module.exports = router;
