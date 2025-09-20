'use client';

interface VideoCardProps {
  title: string;
  creator: string;
  views: number;
  distance?: number;
}

export default function VideoCard({ title, creator, views, distance }: VideoCardProps) {
  return (
    <div className="aspect-[9/16] bg-gray-900 rounded-lg relative overflow-hidden group cursor-pointer">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <h3 className="font-semibold mb-1 line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-300 mb-1">@{creator}</p>
        <div className="flex justify-between items-center text-xs text-gray-400">
          <span>{views.toLocaleString()} views</span>
          {distance && (
            <span className="text-green-400">📍 {distance}mi</span>
          )}
        </div>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <div className="w-0 h-0 border-l-[8px] border-l-white border-y-[6px] border-y-transparent ml-1" />
        </div>
      </div>
    </div>
  );
}
