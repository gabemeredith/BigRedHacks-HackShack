// src/components/BusinessFeed.tsx
import React from "react"
import { useMemo, useState } from 'react'
export type FeedItem = {
  _id: string
  url: string
  thumbnailUrl?: string
  caption?: string
  tags?: string[]
  business?: {
    _id: string
    name: string
    category?: string
    location?: { type: 'Point'; coordinates?: [number, number] }
  }
  createdAt: string
}

type Props = {
  items: FeedItem[]
  title?: string
}

export default function BusinessFeed({ items, title = 'Discover nearby' }: Props) {
  if (!items || items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-3">{title}</h2>
        <EmptyState />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-4 flex items-center gap-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        <span className="text-sm text-gray-500">{items.length} results</span>
      </header>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(item => (
          <FeedCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  )
}

function FeedCard({ item }: { item: FeedItem }) {
  const b = item.business ?? item
  const [open, setOpen] = useState(false)
  const when = useMemo(() => timeAgo(item.createdAt), [item.createdAt])
   // helper to pull [lng, lat] from either shape
   const getCoords = (obj: any): [number, number] | undefined => {
    const c =
      obj?.location?.coordinates ??
      obj?.coordinates?.coordinates ?? // e.g. { coordinates: { coordinates:[lng,lat] } }
      obj?.coordinates;               // in case it's already [lng,lat]
    return Array.isArray(c) && c.length === 2 ? (c as [number, number]) : undefined;
  };
  const coords = getCoords(b);
  const mapsUrl = coords ? `https://www.google.com/maps?q=${coords[1]},${coords[0]}` : undefined;


  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition">
      <button
        className="relative aspect-video w-full overflow-hidden rounded-t-2xl focus:outline-none"
        onClick={() => setOpen(true)}
        aria-label={`Play video for ${item.business?.name ?? 'business'}`}
      >
        {item.thumbnailUrl ? (
          <img
            src={item.thumbnailUrl}
            alt={item.caption || item.business?.name || 'video'}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <video src={item.url} className="h-full w-full object-cover" muted />
        )}
        <div className="absolute inset-0 grid place-items-center">
          <span className="bg-black/55 text-white rounded-full px-3 py-1 text-sm">▶ Play</span>
        </div>
      </button>
        
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-xs text-gray-500">{item.business?.category}</div>
            <div className="font-semibold">{item.business?.name ?? 'Unknown place'}</div>
          </div>
          <div className="text-xs text-gray-500">{when}</div>
        </div>

        {item.caption && (
          <p className="mt-2 text-sm text-gray-700 line-clamp-2">{item.caption}</p>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          {item.tags?.length
            ? item.tags.slice(0, 4).map(t => (
                <span
                  key={t}
                  className="text-xs rounded-full bg-gray-100 text-gray-700 px-2 py-1"
                >
                  #{t}
                </span>
              ))
            : null}
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="ml-auto text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            >
              Map
            </a>
          )}
        </div>
      </div>

      {open && <VideoModal url={item.url} onClose={() => setOpen(false)} />}
    </div>
  )
}

function VideoModal({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-3xl bg-black rounded-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <video src={url} controls autoPlay className="w-full h-auto" />
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-600">
      No results yet. Try adjusting your filters or radius.
    </div>
  )
}

function timeAgo(iso: string) {
  const d = new Date(iso)
  const s = Math.floor((Date.now() - d.getTime()) / 1000)
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const days = Math.floor(h / 24)
  return `${days}d ago`
}
