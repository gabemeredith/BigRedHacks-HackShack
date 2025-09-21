import React from "react";
import { useState, useEffect } from "react";
import { Video, Menu, X } from "lucide-react";

/**
 * Reusable Navbar for LocalLens
 * - Drop this in src/components/Navbar.tsx
 * - TailwindCSS required
 * - Optional: react-router — pass a navigate() handler via props
 */

export type NavItem = {
  id: string;
  label: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export type NavbarProps = {
  items: NavItem[];
  /** currentPage should match item.id to highlight */
  currentPage?: string;
  /** Navigation handler (e.g., from react-router useNavigate) */
  onNavigate?: (path: string) => void;
  onLogoClick?: () => void;
  onUpload?: () => void;
  onSignIn?: () => void;
  onForBusiness?: () => void;
  /** Optional: show Sign In / For Business / Upload buttons on desktop */
  showActions?: boolean;
};

export default function Navbar({
  items,
  currentPage,
  onNavigate,
  onLogoClick,
  onUpload,
  onSignIn,
  onForBusiness,
  showActions = true,
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [elevated, setElevated] = useState(false);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (path: string) => {
    onNavigate?.(path);
    setOpen(false);
  };

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-xl",
        "bg-gradient-to-r from-slate-900/95 to-indigo-900/95",
        elevated ? "shadow-lg shadow-black/20" : "",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={onLogoClick}
            className="flex items-center gap-3 cursor-pointer group"
            aria-label="Go home"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-200">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-slate-900">
                <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
              LocalLens
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => go(item.path)}
                  className={[
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 transform",
                    "hover:scale-105",
                    isActive
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25"
                      : "text-gray-300 hover:text-white hover:bg-white/10",
                  ].join(" ")}
                >
                  {Icon ? <Icon className="w-4 h-4" /> : null}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions + Mobile Toggle */}
          <div className="flex items-center gap-3">
            {showActions && (
              <div className="hidden sm:flex items-center gap-3">
                <button
                  onClick={onSignIn}
                  className="text-gray-300 hover:text-white font-medium transition-colors duration-200 transform hover:scale-105"
                >
                  Sign In
                </button>

                <button
                  onClick={onForBusiness}
                  className="relative group bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/20 hover:shadow-lg hover:shadow-violet-500/25"
                >
                  <span className="relative z-10">For Business</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                </button>

                <button
                  onClick={onUpload}
                  className="relative group overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-purple-500/50"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Upload
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-violet-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-200 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={[
          "lg:hidden transition-[max-height,opacity] duration-300 ease-out overflow-hidden",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <div className="px-4 pb-4 space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => go(item.path)}
                className={[
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium",
                  isActive
                    ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-white/10",
                ].join(" ")}
              >
                {Icon ? <Icon className="w-5 h-5" /> : null}
                {item.label}
              </button>
            );
          })}

          {showActions && (
            <div className="pt-2 grid grid-cols-2 gap-2">
              <button
                onClick={onSignIn}
                className="col-span-1 text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2.5 rounded-xl"
              >
                Sign In
              </button>
              <button
                onClick={onForBusiness}
                className="col-span-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl border border-white/20"
              >
                For Business
              </button>
              <button
                onClick={onUpload}
                className="col-span-2 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 text-white px-4 py-2.5 rounded-xl font-semibold"
              >
                <span className="inline-flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Upload
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/**
 * Example usage (TypeScript):
 *
 * import { useNavigate, useLocation } from "react-router-dom";
 * import { Home, MapPin, Compass } from "lucide-react";
 *
 * const navItems: NavItem[] = [
 *   { id: "home", label: "Home", path: "/", icon: Home },
 *   { id: "nearby", label: "Nearby", path: "/nearby", icon: MapPin },
 *   { id: "explore", label: "Explore", path: "/explore", icon: Compass },
 * ];
 *
 * export function AppNavbar() {
 *   const navigate = useNavigate();
 *   const { pathname } = useLocation();
 *
 *   // Map pathname -> item.id for highlighting
 *   const currentId = navItems.find((i) => i.path === pathname)?.id;
 *
 *   return (
 *     <Navbar
 *       items={navItems}
 *       currentPage={currentId}
 *       onNavigate={(path) => navigate(path)}
 *       onLogoClick={() => navigate("/")}
 *       onSignIn={() => navigate("/login")}
 *       onForBusiness={() => navigate("/dashboard")}
 *       onUpload={() => console.log("open upload modal")}
 *     />
 *   );
 * }
 */
