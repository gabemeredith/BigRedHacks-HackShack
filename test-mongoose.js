require('dotenv').config();
const mongoose = require('mongoose');
console.log("MONGO_URI:", process.env.MONGO_URI); // should print your full URI string


(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Mongo connected!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Mongo error:", err.message);
    process.exit(1);
  }
})();