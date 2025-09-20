// src/api.ts
import axios from 'axios';

export type FeedItem = {
  _id: string;
  url: string;                 // video url
  thumbnailUrl?: string;
  caption?: string;
  tags?: string[];
  business?: { _id: string; name: string; category?: string; location?: { type: 'Point'; coordinates?: [number, number] } };
  createdAt: string;
};

export async function getFeed(params: { lat?: number; lng?: number; r?: number; category?: string } = {}) {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null).map(([k, v]) => [k, String(v)]))
  );
  const { data } = await axios.get<FeedItem[]>(`/api/feed${qs.toString() ? `?${qs}` : ''}`);
  return data;
}