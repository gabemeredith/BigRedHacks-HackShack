export function getYouTubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.slice(1) || null;
    }
    if (u.searchParams.get("v")) {
      return u.searchParams.get("v");
    }
    // embed format
    const parts = u.pathname.split("/");
    const i = parts.findIndex(p => p === "embed");
    if (i >= 0 && parts[i+1]) return parts[i+1];
    return null;
  } catch {
    return null;
  }
}

export function isYouTubeUrl(url) {
  try {
    const h = new URL(url).hostname;
    return h.includes("youtube.com") || h.includes("youtu.be");
  } catch {
    return false;
  }
}
