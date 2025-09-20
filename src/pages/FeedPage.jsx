// src/pages/FeedPage.jsx
import { useEffect, useMemo, useState, useCallback } from 'react'
import axios from 'axios'
import BusinessFeed from '../components/BusinessFeed'          // your grid list (or use FeedCard list directly)
import FilterSideBar from '../components/FilterSideBar'
import VideoModal from '../components/VideoModal'               // (your file is VideoModel)
                                                              // If it's "VideoModal", update import.




                                                              
export default function FeedPage() {
  // UI + query state
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // filters
  const [category, setCategory] = useState('')        // e.g., "Food & Drink"
  const [radius, setRadius] = useState(5000)          // meters
  const [pos, setPos] = useState(null)                // { lat, lng }

  // modal
  const [activeVideo, setActiveVideo] = useState(null) // { url, caption, ... }

  // get browser location once (optional)
  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      p => setPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setPos(null),
      { enableHighAccuracy: true, timeout: 5000 }
    )
  }, [])

  const params = useMemo(() => {
    const p = {}
    if (pos?.lat != null && pos?.lng != null) { p.lat = pos.lat; p.lng = pos.lng }
    if (radius) p.r = radius
    if (category) p.category = category
    return p
  }, [pos, radius, category])

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const qs = new URLSearchParams(params).toString()
      const { data } = await axios.get(`/api/feed${qs ? `?${qs}` : ''}`)
      setItems(data || [])
    } catch (e) {
      console.error(e)
      setError('Failed to load feed')
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => { load() }, [load]) // refetch when filters change

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Sidebar */}
      <aside className="lg:col-span-3">
        <FilterSideBar
          category={category}
          onCategoryChange={setCategory}
          radius={radius}
          onRadiusChange={setRadius}
          position={pos}
          onUseMyLocation={() => {
            if (!navigator.geolocation) return
            navigator.geolocation.getCurrentPosition(
              p => setPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
              () => setPos(null)
            )
          }}
          onClearLocation={() => setPos(null)}
          onRefresh={load}
        />
      </aside>

      {/* Main feed */}
      <main className="lg:col-span-9">
        <header className="flex items-center gap-3 mb-3">
          <h1 className="text-2xl font-bold">What’s happening nearby</h1>
          {loading ? (
            <span className="text-sm text-gray-500">Loading…</span>
          ) : error ? (
            <span className="text-sm text-red-600">{error}</span>
          ) : (
            <span className="text-sm text-gray-500">{items.length} results</span>
          )}
          <button
            className="ml-auto px-3 py-2 rounded-lg bg-black text-white"
            onClick={load}
            disabled={loading}
          >
            Refresh
          </button>
        </header>

        {/* skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && !error && (
          <BusinessFeed
            items={items}
            title=""
            // If your BusinessFeed/FeedCard supports a click handler for video:
            // onPlay={(item)=>setActiveVideo({ url:item.url, caption:item.caption })}
          />
        )}
      </main>

      {/* Centralized video modal */}
      {activeVideo && (
        <VideoModal
          url={activeVideo.url}
          caption={activeVideo.caption}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </div>
  )
}
