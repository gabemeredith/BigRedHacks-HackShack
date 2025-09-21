const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  businessName: {
    type: String,
    trim: true,
    maxlength: [200, 'Business name cannot be more than 200 characters']
  },
  businessAddress: {
    type: String,
    trim: true,
    maxlength: [300, 'Business address cannot be more than 300 characters']
  },
  businessCategory: {
    type: String,
    trim: true,
    enum: ['Food & Drink', 'Local Shopping', 'Arts & Culture', 'Health & Wellness', 'Automotive', 'Services', 'Entertainment', 'Other']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['user', 'business_owner', 'admin'],
    default: 'user'
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    default: null
  },
  profile: {
    avatar: String,
    bio: String,
    phone: String,
    address: String
  },
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    pushNotifications: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ business: 1 });
userSchema.index({ createdAt: -1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Instance method to update last login
userSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  return await this.save({ validateBeforeSave: false });
};

// Static method to find user with business populated
userSchema.statics.findByIdWithBusiness = function(id) {
  return this.findById(id).populate('business');
};

// Virtual for full name (if we ever split first/last name)
userSchema.virtual('displayName').get(function() {
  return this.name || this.email.split('@')[0];
});

module.exports = mongoose.model('User', userSchema);
