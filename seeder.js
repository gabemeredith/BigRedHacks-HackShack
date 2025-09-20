const mongoose = require('mongoose');
const colors = require('colors');
console.log('Starting seeder...');
require('dotenv').config();
console.log('Attempting to connect with URI:', process.env.MONGODB_URI);

// Import models
const Business = require('./models/Business');
const Video = require('./models/Video');
const Review = require('./models/Review');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/locallense');
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

// Sample data for Ithaca, NY businesses (WITHOUT video/review references initially)
const sampleBusinesses = [
  {
    name: "Moosewood Restaurant",
    description: "A legendary vegetarian restaurant that has been serving creative, globally-inspired cuisine since 1973. Known for its cooperative structure and award-winning cookbooks, Moosewood offers fresh, seasonal dishes in a cozy, welcoming atmosphere.",
    category: "Food & Drink",
    priceLevel: "$$",
    address: {
      street: "215 N Cayuga St",
      city: "Ithaca",
      state: "NY",
      zipCode: "14850"
    },
    coordinates: {
      type: "Point",
      coordinates: [-76.5019, 42.4430]
    },
    contactInfo: {
      phoneNumber: "(607) 273-9610",
      website: "https://moosewoodrestaurant.com"
    },
    hoursOfOperation: {
      monday: "Closed",
      tuesday: "11:30 AM - 9:00 PM",
      wednesday: "11:30 AM - 9:00 PM",
      thursday: "11:30 AM - 9:00 PM",
      friday: "11:30 AM - 9:00 PM",
      saturday: "11:30 AM - 9:00 PM",
      sunday: "11:30 AM - 9:00 PM"
    },
    amenities: ["Vegetarian Options", "Vegan Options", "Outdoor Seating", "Takeout", "Local Ingredients", "Wine & Beer"],
    coverImage: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500"
  },
  {
    name: "Ithaca Beer Co.",
    description: "Ithaca's premier craft brewery featuring award-winning beers brewed with Finger Lakes water. Our taproom offers a full menu of pub favorites alongside our signature IPAs, lagers, and seasonal brews. Live music and community events throughout the week.",
    category: "Food & Drink",
    priceLevel: "$$",
    address: {
      street: "122 Ithaca Beer Dr",
      city: "Ithaca",
      state: "NY",
      zipCode: "14850"
    },
    coordinates: {
      type: "Point",
      coordinates: [-76.4951, 42.4401]
    },
    contactInfo: {
      phoneNumber: "(607) 273-0766",
      website: "https://ithacabeer.com"
    },
    hoursOfOperation: {
      monday: "3:00 PM - 9:00 PM",
      tuesday: "3:00 PM - 9:00 PM",
      wednesday: "3:00 PM - 9:00 PM",
      thursday: "3:00 PM - 10:00 PM",
      friday: "12:00 PM - 11:00 PM",
      saturday: "12:00 PM - 11:00 PM",
      sunday: "12:00 PM - 8:00 PM"
    },
    amenities: ["Craft Beer", "Live Music", "Outdoor Seating", "Pet Friendly", "Parking Available", "Food Truck"],
    coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500"
  },
  {
    name: "The History Center in Tompkins County",
    description: "Explore the rich history of Ithaca and Tompkins County through engaging exhibits, artifacts, and interactive displays. From Native American heritage to Cornell University's founding, discover the stories that shaped our community.",
    category: "Arts & Culture",
    priceLevel: "$",
    address: {
      street: "401 E State St",
      city: "Ithaca",
      state: "NY",
      zipCode: "14850"
    },
    coordinates: {
      type: "Point",
      coordinates: [-76.4908, 42.4398]
    },
    contactInfo: {
      phoneNumber: "(607) 273-8284",
      website: "https://thehistorycenter.net"
    },
    hoursOfOperation: {
      monday: "Closed",
      tuesday: "Closed",
      wednesday: "11:00 AM - 5:00 PM",
      thursday: "11:00 AM - 5:00 PM",
      friday: "11:00 AM - 5:00 PM",
      saturday: "11:00 AM - 5:00 PM",
      sunday: "Closed"
    },
    amenities: ["Educational Programs", "Gift Shop", "Guided Tours", "Research Library", "Wheelchair Accessible"],
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500"
  },
  {
    name: "Autumn Leaves Used Books",
    description: "A beloved independent bookstore featuring three floors of carefully curated used books, rare finds, and local author works. Browse our extensive collection of fiction, non-fiction, and academic texts in a cozy, literary atmosphere.",
    category: "Local Shopping",
    priceLevel: "$",
    address: {
      street: "409 W State St",
      city: "Ithaca",
      state: "NY",
      zipCode: "14850"
    },
    coordinates: {
      type: "Point",
      coordinates: [-76.5089, 42.4389]
    },
    contactInfo: {
      phoneNumber: "(607) 273-4073",
      website: "https://autumnleavesbooks.com"
    },
    hoursOfOperation: {
      monday: "10:00 AM - 9:00 PM",
      tuesday: "10:00 AM - 9:00 PM",
      wednesday: "10:00 AM - 9:00 PM",
      thursday: "10:00 AM - 9:00 PM",
      friday: "10:00 AM - 9:00 PM",
      saturday: "10:00 AM - 9:00 PM",
      sunday: "11:00 AM - 6:00 PM"
    },
    amenities: ["WiFi", "Reading Areas", "Local Authors", "Book Buyback", "Special Orders", "Literary Events"],
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500"
  },
  {
    name: "The Haunt",
    description: "Ithaca's iconic live music venue hosting everything from indie rock to electronic shows. With its intimate setting and excellent acoustics, The Haunt has welcomed both emerging artists and established acts for over two decades.",
    category: "Nightlife & Events",
    priceLevel: "$$",
    address: {
      street: "702 Willow Ave",
      city: "Ithaca",
      state: "NY",
      zipCode: "14850"
    },
    coordinates: {
      type: "Point",
      coordinates: [-76.5158, 42.4505]
    },
    contactInfo: {
      phoneNumber: "(607) 275-3447",
      website: "https://thehaunt.com"
    },
    hoursOfOperation: {
      monday: "Closed",
      tuesday: "Closed",
      wednesday: "Event Dependent",
      thursday: "Event Dependent",
      friday: "Event Dependent",
      saturday: "Event Dependent",
      sunday: "Event Dependent"
    },
    amenities: ["Live Music", "Full Bar", "All Ages Shows", "Merchandise", "Sound System", "Dance Floor"],
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500"
  }
];

// Sample videos data (will be linked to businesses later)
const sampleVideos = [
  {
    url: "https://example.com/videos/moosewood-cooking.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1556909114-9b35b87b2b96?w=300",
    caption: "Watch our chefs prepare today's seasonal vegetarian specials"
  },
  {
    url: "https://example.com/videos/moosewood-atmosphere.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300",
    caption: "Experience the warm, welcoming atmosphere at Moosewood"
  },
  {
    url: "https://example.com/videos/ithaca-beer-brewing.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=300",
    caption: "Behind the scenes in our brewing process"
  },
  {
    url: "https://example.com/videos/ithaca-beer-taproom.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=300",
    caption: "Live music night at our taproom"
  },
  {
    url: "https://example.com/videos/history-center-tour.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300",
    caption: "Take a virtual tour of our latest exhibit"
  }
];

// Sample reviews data (will be linked to businesses later)
const sampleReviews = [
  {
    rating: 5,
    comment: "Absolutely love this place! The food is always fresh and creative. Been coming here for years and it never disappoints."
  },
  {
    rating: 4,
    comment: "Great vegetarian options and cozy atmosphere. The service was friendly and knowledgeable about the menu."
  },
  {
    rating: 5,
    comment: "Best brewery in Ithaca! The IPA selection is outstanding and the live music creates such a fun atmosphere."
  },
  {
    rating: 4,
    comment: "Love the community feel here. Great place to hang out with friends and try new beers."
  },
  {
    rating: 5,
    comment: "Fascinating local history! The exhibits are well-curated and the staff is very knowledgeable."
  },
  {
    rating: 4,
    comment: "A hidden gem for book lovers. Found some rare titles I've been searching for. Great browsing experience."
  },
  {
    rating: 5,
    comment: "Amazing venue for live music. Intimate setting with great sound quality. Always a good show here!"
  },
  {
    rating: 4,
    comment: "The Haunt never fails to deliver great entertainment. Love the diverse lineup of artists they bring in."
  }
];

// Import data function - FIXED ORDER
const importData = async () => {
  try {
    await connectDB();
    
    console.log('Deleting existing data...'.yellow);
    await Business.deleteMany();
    await Video.deleteMany();
    await Review.deleteMany();
    
    // STEP 1: Create businesses first (without video/review references)
    console.log('Creating businesses...'.green);
    const createdBusinesses = await Business.insertMany(sampleBusinesses);
    console.log(`Created ${createdBusinesses.length} businesses`.green);
    
    // STEP 2: Create videos with proper business references
    console.log('Creating videos with business references...'.green);
    const videosWithBusinessIds = sampleVideos.map((video, index) => {
      let businessId;
      
      if (index < 2) {
        businessId = createdBusinesses[0]._id; // Moosewood
      } else if (index < 4) {
        businessId = createdBusinesses[1]._id; // Ithaca Beer
      } else {
        businessId = createdBusinesses[2]._id; // History Center
      }
      
      return {
        ...video,
        business: businessId
      };
    });
    
    const createdVideos = await Video.insertMany(videosWithBusinessIds);
    console.log(`Created ${createdVideos.length} videos`.green);
    
    // STEP 3: Create reviews with proper business references
    console.log('Creating reviews with business references...'.green);
    const reviewsWithBusinessIds = sampleReviews.map((review, index) => {
      let businessId;
      
      if (index < 2) {
        businessId = createdBusinesses[0]._id; // Moosewood
      } else if (index < 4) {
        businessId = createdBusinesses[1]._id; // Ithaca Beer
      } else if (index < 5) {
        businessId = createdBusinesses[2]._id; // History Center
      } else if (index < 6) {
        businessId = createdBusinesses[3]._id; // Autumn Leaves
      } else {
        businessId = createdBusinesses[4]._id; // The Haunt
      }
      
      return {
        ...review,
        business: businessId
      };
    });
    
    const createdReviews = await Review.insertMany(reviewsWithBusinessIds);
    console.log(`Created ${createdReviews.length} reviews`.green);
    
    // STEP 4: Update businesses with video and review references
    console.log('Updating business references...'.green);
    
    // Moosewood - first 2 videos and reviews
    await Business.findByIdAndUpdate(createdBusinesses[0]._id, {
      videos: [createdVideos[0]._id, createdVideos[1]._id],
      reviews: [createdReviews[0]._id, createdReviews[1]._id]
    });
    
    // Ithaca Beer - next 2 videos and reviews
    await Business.findByIdAndUpdate(createdBusinesses[1]._id, {
      videos: [createdVideos[2]._id, createdVideos[3]._id],
      reviews: [createdReviews[2]._id, createdReviews[3]._id]
    });
    
    // History Center - 1 video and 1 review
    await Business.findByIdAndUpdate(createdBusinesses[2]._id, {
      videos: [createdVideos[4]._id],
      reviews: [createdReviews[4]._id]
    });
    
    // Autumn Leaves - 1 review
    await Business.findByIdAndUpdate(createdBusinesses[3]._id, {
      reviews: [createdReviews[5]._id]
    });
    
    // The Haunt - 2 reviews
    await Business.findByIdAndUpdate(createdBusinesses[4]._id, {
      reviews: [createdReviews[6]._id, createdReviews[7]._id]
    });
    
    console.log(`Data Imported Successfully!`.green.inverse);
    console.log(`✅ Created ${createdBusinesses.length} businesses`.green);
    console.log(`✅ Created ${createdVideos.length} videos`.green);
    console.log(`✅ Created ${createdReviews.length} reviews`.green);
    console.log(`🎉 All data seeded successfully!`.cyan.bold);
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

// Destroy data function
const destroyData = async () => {
  try {
    await connectDB();
    
    console.log('Destroying all data...'.red);
    await Business.deleteMany();
    await Video.deleteMany();
    await Review.deleteMany();
    
    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

// Handle command line arguments
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}