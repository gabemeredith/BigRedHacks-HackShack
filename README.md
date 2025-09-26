# LocalLens 🎬

**Discover Local Businesses Through Authentic Short-Form Videos**

LocalLens is a revolutionary social platform that connects communities with local businesses through engaging short-form video content. Built for BigRedHacks 2025, LocalLens transforms how people discover and interact with local businesses by providing authentic, video-driven experiences.

## 🌟 Features

### 🎥 Video-First Discovery
- **Short-Form Video Feed**: TikTok-style interface for discovering local businesses
- **Authentic Content**: Real videos from business owners and customers
- **Interactive Reels**: Swipe through engaging business content

### 🏪 Business Profiles
- **Comprehensive Business Information**: Hours, contact info, amenities, and more
- **Video Showcase**: Multiple videos per business for complete representation
- **Customer Reviews**: Integrated review system with video testimonials

### 🗺️ Location-Based Features
- **Geographic Search**: Find businesses within your radius
- **Map Integration**: Visual representation of business locations
- **Local Focus**: Designed specifically for community discovery

### 👤 User Experience
- **Modern UI/UX**: Clean, intuitive interface built with React and Tailwind CSS
- **Responsive Design**: Seamless experience across all devices
- **Real-Time Updates**: Live data synchronization

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication and authorization

### Development Tools
- **MongoDB Memory Server** - In-memory database for development
- **CORS** - Cross-origin resource sharing
- **ESLint** - Code linting and formatting

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gabemeredith/BigRedHacks-HackShack.git
   cd BigRedHacks-HackShack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development servers**
   ```bash
   # Start backend server (runs on port 5000)
   npm start
   
   # In a new terminal, start frontend development server (runs on port 4000)
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:4000
   - Backend API: http://localhost:5000

### Database Setup
The application uses MongoDB Memory Server for development, which automatically creates an in-memory database when the server starts. No additional database setup is required.

## 📱 Application Structure

### Pages
- **Home Page** - Landing page with business discovery
- **Reels Page** - Video feed for business content
- **Feed Page** - Business listing with filters
- **Map View** - Geographic business discovery
- **Business Profile** - Detailed business information
- **Dashboard** - Business owner management interface

### Key Components
- **VideoReelItem** - Individual video display component
- **ReelsFeed** - Video feed container
- **BusinessCard** - Business information display
- **FilterSidebar** - Search and filter interface
- **UnifiedHeader** - Navigation component

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Businesses
- `GET /api/businesses` - Get all businesses
- `GET /api/businesses/:id` - Get business by ID
- `POST /api/businesses` - Create new business
- `PUT /api/businesses/:id` - Update business
- `DELETE /api/businesses/:id` - Delete business

### Videos
- `GET /api/videos` - Get all videos
- `POST /api/videos` - Upload new video
- `GET /api/feed` - Get video feed

### Development
- `GET /api/health` - Health check
- `POST /api/seed-videos` - Seed database with sample data

## 🎯 Hackathon Highlights

### Problem Solved
LocalLens addresses the challenge of discovering authentic local businesses in an increasingly digital world. Traditional business directories lack the personal touch and visual appeal needed to truly understand what a business offers.

### Innovation
- **Video-First Approach**: Unlike traditional business directories, LocalLens prioritizes video content for authentic business representation
- **Community-Driven**: Encourages both business owners and customers to create content
- **Mobile-Optimized**: Designed for the mobile-first generation

### Technical Achievements
- **Full-Stack Development**: Complete MERN stack implementation
- **Real-Time Features**: Live video feed updates
- **Responsive Design**: Seamless experience across all devices
- **Scalable Architecture**: Modular design for future expansion

## 🏆 Demo

### Current Video Content
The application currently features curated YouTube videos showcasing local business content:

1. **Business Showcase Videos** - Professional business presentations
2. **Customer Testimonials** - Authentic customer experiences
3. **Behind-the-Scenes Content** - Unique business insights

### Sample Business Data
- **Local Business Hub** - Featured business with multiple video content
- **Geographic Location** - Ithaca, NY area focus
- **Category Coverage** - Food & Drink, Services, Retail

## 🔮 Future Enhancements

### Planned Features
- **User Authentication** - Complete user registration and login system
- **Video Upload** - Direct video upload functionality
- **Social Features** - Likes, comments, and sharing
- **Business Analytics** - Performance metrics for business owners
- **Payment Integration** - Booking and payment processing

### Scalability
- **Multi-City Support** - Expand beyond local area
- **AI-Powered Recommendations** - Smart business suggestions
- **Advanced Search** - Enhanced filtering and search capabilities
- **Mobile App** - Native iOS and Android applications

## 👥 Team

**BigRedHacks 2024 Team**
- Full-stack development
- UI/UX design
- Database architecture
- API development

## 📄 License

This project is developed for BigRedHacks 2025. All rights reserved.

## 🤝 Contributing

This is a hackathon project. For questions or collaboration opportunities, please contact the development team.

## 📞 Contact

- **GitHub**: [BigRedHacks-HackShack](https://github.com/gabemeredith/BigRedHacks-HackShack)
- **Event**: BigRedHacks 2025
- **Location**: Cornell University

---

**Built with ❤️ for BigRedHacks**

*LocalLens - Connecting communities through authentic business stories*
