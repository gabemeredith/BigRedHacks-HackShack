import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import ReelItem from "./ReelItem";

export default function ReelsFeed({ videos }) {
  // Debug logging
  console.log('ReelsFeed render:', { videosLength: videos?.length, videos });
  
  // One wrapper element per reel; we'll observe these
  const containersRef = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const playersRef = useRef(new Map());
  const observerRef = useRef(null);

  // Early return if no videos
  if (!videos || videos.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white">
        <div className="text-center max-w-md px-4">
          <div className="text-8xl mb-6">🎬</div>
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">No Videos Available</h1>
          <p className="text-gray-400 mb-8 text-lg leading-relaxed">
            Local businesses haven't uploaded videos yet. Check back soon for amazing content!
          </p>
        </div>
      </div>
    );
  }

  // Register players so we can play/pause from here
  const registerPlayer = useCallback((id, player) => {
    playersRef.current.set(id, player);
  }, []);

  // Build observer once and observe all current containers
  useEffect(() => {
    // Clean up any previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    const opts = {
      root: null, // viewport
      rootMargin: "0px",
      threshold: [0, 0.25, 0.5, 0.75, 1],
    };

    const io = new IntersectionObserver((entries) => {
      // Pick the visible section with the highest ratio
      let bestIdx = activeIndex;
      let bestRatio = -1;
      for (const entry of entries) {
        const target = entry?.target;
        if (!target) continue;
        const idxAttr = target.getAttribute("data-index");
        if (idxAttr == null) continue;
        const idx = Number(idxAttr);
        const ratio = entry.intersectionRatio ?? 0;
        // We only consider entries actually intersecting
        if (entry.isIntersecting && ratio > bestRatio) {
          bestRatio = ratio;
          bestIdx = Number.isNaN(idx) ? bestIdx : idx;
        }
      }
      if (bestRatio >= 0 && bestIdx !== activeIndex) {
        setActiveIndex(bestIdx);
      }
    }, opts);

    // Observe each container that exists
    (containersRef.current || []).forEach((el) => {
      if (el) io.observe(el);
    });

    observerRef.current = io;
    return () => {
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videos.length]); // rerun when list size changes

  // Ensure only the active player runs
  useEffect(() => {
    const players = playersRef.current;
    videos.forEach((v, idx) => {
      const p = players.get(v.id);
      if (!p) return;
      try {
        if (idx === activeIndex) p.playVideo?.();
        else p.pauseVideo?.();
      } catch {}
    });
  }, [activeIndex, videos]);

  // Navigation functions
  const scrollToReel = (index) => {
    if (index >= 0 && index < videos.length) {
      const target = document.querySelector(`[data-index="${index}"]`);
      target?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const goToNext = () => {
    scrollToReel(activeIndex + 1);
  };

  const goToPrevious = () => {
    scrollToReel(activeIndex - 1);
  };

  // Keyboard navigation (optional but handy)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        const next = document.querySelector(`[data-index="${activeIndex + 1}"]`);
        next?.scrollIntoView({ behavior: "smooth" });
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        const prev = document.querySelector(`[data-index="${activeIndex - 1}"]`);
        prev?.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", onKey, { passive: false });
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex]);

  return (
    <div
      className="h-full w-full overflow-y-auto snap-y snap-mandatory scroll-smooth bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900"
      style={{ scrollbarWidth: "none" }}
    >
      {videos.map((v, i) => (
        <div
          key={v.id}
          ref={(el) => (containersRef.current[i] = el)}
          data-index={i}
          className="snap-start h-full"
        >
          <ReelItem
            video={v}
            active={i === activeIndex}
            onReady={(id, player) => registerPlayer(id, player)}
            onPlayState={() => {}}
          />
        </div>
      ))}

      {/* Floating Navigation Buttons */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 space-y-3">
        {/* Previous Button */}
        <button
          onClick={goToPrevious}
          disabled={activeIndex === 0}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
            activeIndex === 0
              ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-violet-600/90 to-purple-600/90 hover:from-violet-700 hover:to-purple-700 text-white hover:scale-110 backdrop-blur-sm border border-white/20 hover:border-white/40 shadow-violet-500/25 hover:shadow-violet-500/40'
          }`}
          title="Previous reel"
        >
          <ChevronUp className="w-7 h-7" />
        </button>

        {/* Next Button */}
        <button
          onClick={goToNext}
          disabled={activeIndex === videos.length - 1}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
            activeIndex === videos.length - 1
              ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-violet-600/90 to-purple-600/90 hover:from-violet-700 hover:to-purple-700 text-white hover:scale-110 backdrop-blur-sm border border-white/20 hover:border-white/40 shadow-violet-500/25 hover:shadow-violet-500/40'
          }`}
          title="Next reel"
        >
          <ChevronDown className="w-7 h-7" />
        </button>
      </div>

    </div>
  );
}
