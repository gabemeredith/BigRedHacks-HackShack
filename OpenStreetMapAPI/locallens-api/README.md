# LocalLens API

A simple Node.js + Express API that lets you search for **local businesses** within a radius of a given location, filtered by category (restaurants, clothing, art, entertainment, miscellaneous).  

It uses **OpenStreetMap’s Overpass API** as the data source (free, no API key required). Perfect for hackathons and prototypes.

---

## 🚀 Features
- Search by **latitude/longitude** and **radius (meters)**
- Filter by categories:
  - `restaurants` (restaurants, cafes, bars, pubs, fast food)
  - `clothing` (clothing, shoes, boutiques, fashion shops)
  - `art` (galleries, art centers, art shops)
  - `entertainment` (cinemas, theatres, nightclubs, casinos, arcades, bowling)
  - `miscellaneous` (markets, convenience stores, gift shops, etc.)
- Results include:
  - Name
  - Location (lat/lon)
  - Distance from query point
  - Address (if available)
  - Website / phone (if available)
  - Category hints (from OSM tags)

---

## 📦 Installation

```bash
# clone or create project folder
cd Map\ ChatGPT\ Implement

# move into API folder
cd locallens-api

# install dependencies
npm install
