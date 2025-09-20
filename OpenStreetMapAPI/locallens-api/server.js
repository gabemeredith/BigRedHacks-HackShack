// server.js
import express from 'express';
import fetch from 'node-fetch';
import memoize from 'p-memoize';
import { z } from 'zod';

const app = express();

// ---------- Config ----------
const PORT = process.env.PORT || 3000;
const MAX_RADIUS_M = 15000;  // 15 km cap for free Overpass
const DEFAULT_RADIUS_M = 2500;
const DEFAULT_LIMIT = 50;

const CATEGORY_MAP = {
  restaurants: [
    { key: 'amenity', values: ['restaurant','fast_food','cafe','bar','pub'] }
  ],
  clothing: [
    { key: 'shop', values: ['clothes','shoes','boutique','fashion'] }
  ],
  art: [
    { key: 'tourism', values: ['gallery'] },
    { key: 'amenity', values: ['arts_centre'] },
    { key: 'shop', values: ['art'] },
    { key: 'amenity', values: ['art_school'] }
  ],
  entertainment: [
    { key: 'amenity', values: ['cinema','theatre','nightclub','casino'] },
    { key: 'leisure', values: ['amusement_arcade','escape_game','bowling_alley'] }
  ],
  miscellaneous: [
    { key: 'amenity', values: ['marketplace','community_centre'] },
    { key: 'shop', values: ['convenience','gift','kiosk','mall','variety_store'] }
  ],
};

// ---------- Utils ----------
const ParamsSchema = z.object({
  lat: z.coerce.number().refine(n => Math.abs(n) <= 90, 'lat must be between -90 and 90'),
  lon: z.coerce.number().refine(n => Math.abs(n) <= 180, 'lon must be between -180 and 180'),
  radius: z.coerce.number().default(DEFAULT_RADIUS_M)
    .transform(n => Math.max(100, Math.min(n, MAX_RADIUS_M))),
  category: z.string().default('restaurants'),
  limit: z.coerce.number().default(DEFAULT_LIMIT).transform(n => Math.max(1, Math.min(n, 200))),
  provider: z.string().default('osm') // future: 'google' | 'foursquare' | 'yelp'
});

const toRad = d => d * Math.PI / 180;
function distanceMeters(a, b) {
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const s = Math.sin(dLat/2)**2 +
            Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*Math.sin(dLon/2)**2;
  return Math.round(2 * R * Math.atan2(Math.sqrt(s), Math.sqrt(1-s)));
}

function buildOverpassQL({ lat, lon, radius, category }) {
  const blocks = CATEGORY_MAP[category] || CATEGORY_MAP.miscellaneous;
  const orFilters = blocks.map(({ key, values }) => {
    const regex = `^(${values.join('|')})$`;
    return `[${key}~"${regex}"]`;
  });

  const union = orFilters.map(f => `
    node(around:${radius},${lat},${lon})${f};
    way(around:${radius},${lat},${lon})${f};
    relation(around:${radius},${lat},${lon})${f};
  `).join('\n');

  return `
  [out:json][timeout:25];
  (
    ${union}
  );
  out center tags;
  `;
}

async function overpassSearch({ lat, lon, radius, category, limit }) {
  const ql = buildOverpassQL({ lat, lon, radius, category });

  const r = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: ql
  });
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    throw new Error(`Overpass error: ${r.status} ${text?.slice(0,200)}`);
  }
  const json = await r.json();

  const elements = Array.isArray(json.elements) ? json.elements : [];
  const places = elements.map(e => {
    const center = e.type === 'node' ? { lat: e.lat, lon: e.lon } : (e.center || {});
    const t = e.tags || {};
    const address = [
      t['addr:housenumber'],
      t['addr:street'],
      [t['addr:city'], t['addr:state']].filter(Boolean).join(', ')
    ].filter(Boolean).join(' ');
    return {
      id: `${e.type}/${e.id}`,
      name: t.name || t.brand || 'Unnamed',
      lat: center.lat, lon: center.lon,
      distance_m: distanceMeters({ lat, lon }, center),
      address: address || null,
      website: t.website || t['contact:website'] || null,
      phone: t.phone || t['contact:phone'] || null,
      category_hint: ['amenity','shop','tourism','leisure']
        .filter(k => t[k]).map(k => `${k}:${t[k]}`),
      source: 'osm',
      raw: undefined // omit to keep payload light; add if you need it
    };
  }).filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lon));

  // sort by distance then name; cap by limit
  return places.sort((a,b) => a.distance_m - b.distance_m || (a.name||'').localeCompare(b.name||''))
               .slice(0, limit);
}

// Cache identical queries for a few minutes to be nice to Overpass
const cachedOverpassSearch = memoize(overpassSearch, { maxAge: 1000 * 60 * 5 });

// ---------- Routes ----------
app.get('/health', (_, res) => res.json({ ok: true }));

// GET /api/places?lat=...&lon=...&radius=2500&category=restaurants&limit=50
app.get('/api/places', async (req, res) => {
  try {
    const params = ParamsSchema.parse(req.query);
    const category = params.category.toLowerCase();
    const provider = params.provider.toLowerCase();

    // Basic validation
    if (!Object.keys(CATEGORY_MAP).includes(category)) {
      return res.status(400).json({ error: `unknown category: ${category}` });
    }

    let results = [];
    switch (provider) {
      case 'osm':
        results = await cachedOverpassSearch({ ...params, category });
        break;

      // Stubs you can implement later:
      case 'google':
      case 'foursquare':
      case 'yelp':
        return res.status(501).json({ error: `provider ${provider} not implemented yet` });

      default:
        return res.status(400).json({ error: `unknown provider: ${provider}` });
    }

    res.json({
      query: { lat: params.lat, lon: params.lon, radius: params.radius, category, limit: params.limit, provider },
      count: results.length,
      places: results
    });
  } catch (err) {
    console.error(err);
    const message = err?.message || 'unexpected error';
    return res.status(400).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`LocalLens Places API running on http://localhost:${PORT}`);
});
