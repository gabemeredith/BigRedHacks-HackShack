// src/components/FeedCard.tsx
import { useState } from 'react';
import type { FeedItem } from '../api';
import * as React from "react"

export default function FeedCard({ item }: { item: FeedItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl shadow p-3 bg-white hover:shadow-md transition">
      <div className="relative aspect-video rounded-xl overflow-hidden cursor-pointer" onClick={() => setOpen(true)}>
        {item.thumbnailUrl ? (
          <img src={item.thumbnailUrl} alt={item.caption || item.business?.name || 'video'} className="h-full w-full object-cover" />
        ) : (
          <video src={item.url} className="h-full w-full object-cover" muted />
        )}
        <div className="absolute inset-0 grid place-items-center">
          <div className="bg-black/50 text-white rounded-full px-3 py-1 text-sm">▶︎ Play</div>
        </div>
      </div>
      <div className="mt-3">
        <div className="text-sm text-gray-500">{item.business?.category}</div>
        <div className="font-semibold">{item.business?.name}</div>
        {item.caption && <div className="text-gray-700 text-sm mt-1 line-clamp-2">{item.caption}</div>}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/60 z-50 grid place-items-center" onClick={() => setOpen(false)}>
          <div className="w-full max-w-3xl mx-4 bg-black rounded-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <video src={item.url} controls autoPlay className="w-full h-auto" />
          </div>
        </div>
      )}
    </div>
  );
}
