import { useEffect, useMemo, useRef, useState } from "react";
import YouTube from "react-youtube";
import { getYouTubeId, isYouTubeUrl } from "../../lib/youtube";

export default function ReelItem({ video, active, onReady, onPlayState }) {
  const [muted, setMuted] = useState(false); // Start with audio ON by default
  const [isInitialized, setIsInitialized] = useState(false);
  const ytRef = useRef(null);

  const ytId = useMemo(() => isYouTubeUrl(video.url) ? getYouTubeId(video.url) : null, [video.url]);

  // Initialize mute state from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem("reels-muted");
    if (saved !== null) {
      setMuted(saved === "true");
    } else {
      // Default to unmuted (audio ON)
      setMuted(false);
    }
    setIsInitialized(true);
  }, []);

  // Persist mute preference to sessionStorage
  useEffect(() => {
    if (isInitialized) {
      sessionStorage.setItem("reels-muted", String(muted));
    }
  }, [muted, isInitialized]);

  // Play/pause based on active state
  useEffect(() => {
    const p = ytRef.current;
    if (!p || !isInitialized) return;
    if (active) {
      p.playVideo?.();
    } else {
      try { p.pauseVideo?.(); } catch {}
    }
  }, [active, isInitialized]);

  // Un/mute the player when user toggles
  useEffect(() => {
    const p = ytRef.current;
    if (!p || !isInitialized) return;
    try {
      if (muted) p.mute?.();
      else p.unMute?.();
    } catch {}
  }, [muted, isInitialized]);

  if (!ytId) {
    // non-YouTube placeholder (future)
    return (
      <section className="reels-item h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white">
        <div className="max-w-xl p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50 mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">{video.title}</h2>
          <p className="opacity-75 mt-2 text-gray-300">Unsupported video source for now.</p>
        </div>
      </section>
    );
  }

  // Make the section full-height and center the player
  return (
    <section className="relative reels-item h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <div className="w-full h-full flex items-center justify-center p-3">
        <div className="relative w-full h-full max-w-[95vw] max-h-[95vh]">
          <YouTube
            videoId={ytId}
            className="absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-2xl"
            iframeClassName="w-full h-full rounded-xl"
            style={{
              aspectRatio: 'auto'
            }}
            opts={{
              width: '100%',
              height: '100%',
              playerVars: {
                autoplay: active ? 1 : 0,  // only autoplay if this video is active
                controls: 0,               // hide controls for cleaner look
                mute: muted ? 1 : 0,       // use current mute state
                playsinline: 1,
                rel: 0,
                modestbranding: 1,
                enablejsapi: 1,
                origin: typeof window !== "undefined" ? window.location.origin : undefined,
                fs: 1,                     // allow fullscreen
                iv_load_policy: 3,         // hide annotations
                cc_load_policy: 0,         // hide captions
              }
            }}
            onReady={(e) => {
              ytRef.current = e.target;
              // Apply initial mute state when player is ready
              if (isInitialized) {
                try {
                  if (muted) e.target.mute();
                  else e.target.unMute();
                } catch {}
              }
              onReady?.(video.id, e.target);
            }}
            onStateChange={(e) => {
              // 1 = playing, 2 = paused, 0 = ended
              onPlayState?.(video.id, e.data === 1);
            }}
          />
        </div>
      </div>

      {/* Overlay UI */}
      <div className="absolute left-6 bottom-6 text-white space-y-3 drop-shadow-lg z-10">
        <div className="bg-gradient-to-r from-slate-900/90 to-indigo-900/90 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
          <div className="text-sm opacity-90 mb-1">{video.businessName ?? ""}</div>
          <div className="font-bold text-lg mb-2 bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">{video.title}</div>
          {typeof video.distanceMi === "number" && (
            <div className="flex items-center gap-1 text-xs opacity-80">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {video.distanceMi.toFixed(1)} mi away
            </div>
          )}
        </div>
      </div>

      {/* Sound toggle - only show on active reel */}
      {active && (
        <div className="absolute right-6 bottom-6 space-y-2 z-10">
          <button
            onClick={() => setMuted(m => !m)}
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-slate-900/90 to-indigo-900/90 text-white text-sm backdrop-blur-sm hover:from-slate-800/90 hover:to-indigo-800/90 transition-all duration-200 border border-white/20 hover:border-white/40 shadow-lg hover:scale-105 transform"
          >
            <div className="flex items-center gap-2">
              {muted ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L5.64 14H2a1 1 0 01-1-1V7a1 1 0 011-1h3.64l2.743-2.793a1 1 0 011-.131zM12 8.414l1.293-1.293a1 1 0 011.414 1.414L13.414 10l1.293 1.293a1 1 0 01-1.414 1.414L12 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L10.586 10l-1.293-1.293a1 1 0 011.414-1.414L12 8.586z" clipRule="evenodd" />
                  </svg>
                  <span>Tap for sound</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L5.64 14H2a1 1 0 01-1-1V7a1 1 0 011-1h3.64l2.743-2.793a1 1 0 011-.131z" clipRule="evenodd" />
                  </svg>
                  <span>Mute</span>
                </>
              )}
            </div>
          </button>
        </div>
      )}
    </section>
  );
}
