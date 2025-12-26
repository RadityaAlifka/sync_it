import { useState, useEffect } from "react";
import { Settings, Music2, Youtube, LayoutGrid, Lock, Unlock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";

// --- CUSTOM ICONS ---
const SpotifyLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const isOpen = isHovered || isPinned;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setIsPinned((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const mainItems = [
    { name: "Overview", icon: LayoutGrid, path: "/dashboard" },
    { name: "Settings", icon: Settings, path: "/profile" },
  ];

  const platformItems = [
    { 
      name: "Spotify", 
      icon: SpotifyLogo, 
      path: "/library/spotify", 
      color: "text-spotify-green", 
      // Definisikan class background secara eksplisit agar Tailwind membacanya
      barColor: "bg-spotify-green",
      shadowColor: "shadow-[0_0_15px_rgba(29,185,84,0.6)]",
      hoverBg: "hover:bg-spotify-green/10" 
    },
    { 
      name: "YouTube Music", 
      icon: Youtube, 
      path: "/library/youtube", 
      color: "text-[#FF0000]", 
      // Definisikan class background secara eksplisit
      barColor: "bg-[#FF0000]",
      shadowColor: "shadow-[0_0_15px_rgba(255,0,0,0.6)]",
      hoverBg: "hover:bg-red-500/10" 
    },
  ];

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        // Perbaikan Animasi Container: Lebih lambat (700ms) & kurva halus
        "h-full bg-black border-r border-border/50 flex flex-col transition-[width] duration-700 ease-[cubic-bezier(0.2,0,0,1)] shrink-0 relative z-50 overflow-hidden",
        isOpen ? "w-[260px]" : "w-[80px]"
      )}
    >
      
      {/* --- LOGO SECTION --- */}
      <div className={cn("flex items-center gap-3 mt-6 mb-8 transition-all duration-500", isOpen ? "px-6" : "px-0 justify-center")}>
        <div className={cn(
            "rounded-full bg-spotify-green flex items-center justify-center shadow-[0_0_15px_rgba(29,185,84,0.3)] transition-all duration-500",
            isOpen ? "w-8 h-8" : "w-10 h-10"
        )}>
            <Music2 className="w-5 h-5 text-black" />
        </div>
        
        <div className={cn(
            "overflow-hidden whitespace-nowrap transition-opacity",
            // Teks hanya muncul jika terbuka, dan hilang INSTAN saat tutup
            isOpen ? "w-40 opacity-100 duration-500 delay-200" : "w-0 opacity-0 duration-0 delay-0"
        )}>
            <h1 className="text-xl font-bold text-white tracking-tight">Sync It</h1>
        </div>
      </div>

      {/* --- MENU SECTION --- */}
      <div className="flex flex-col gap-6 flex-1">
        
        {/* Main Menu */}
        <div className="flex flex-col gap-1">
          <p className={cn(
              "px-6 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider transition-opacity",
              isOpen ? "opacity-100 duration-500 delay-100" : "opacity-0 duration-0 hidden"
          )}>
            Menu
          </p>
          
          <nav className="flex flex-col gap-1 px-3">
            {mainItems.map((item) => {
               const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
               return (
                <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={cn(
                    "flex items-center gap-3 py-3 rounded-lg transition-all duration-300 group relative",
                    isOpen ? "px-3" : "justify-center px-0",
                    isActive ? "bg-white/10 text-white shadow-lg" : "text-muted-foreground hover:text-white hover:bg-white/5"
                    )}
                >
                    <item.icon className={cn("w-5 h-5 min-w-5 transition-transform duration-300", !isOpen && "group-hover:scale-110")} />
                    
                    <span className={cn(
                        "whitespace-nowrap overflow-hidden transition-opacity",
                        // Logic animasi teks: Delay saat buka, Instan saat tutup
                        isOpen ? "w-auto opacity-100 ml-1 duration-300 delay-100" : "w-0 opacity-0 ml-0 duration-0"
                    )}>
                        {item.name}
                    </span>

                    {isActive && (
                        <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                    )}
                </button>
               );
            })}
          </nav>
        </div>

        {/* Platform Menu */}
        <div className="flex flex-col gap-1">
          <p className={cn(
              "px-6 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider transition-opacity",
              isOpen ? "opacity-100 duration-500 delay-100" : "opacity-0 duration-0 hidden"
          )}>
            Platforms
          </p>
          
          <nav className="flex flex-col gap-1 px-3">
            {platformItems.map((item) => {
               const isActive = location.pathname === item.path;
               return (
                <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={cn(
                    "flex items-center gap-3 py-3 rounded-lg transition-all duration-300 group relative",
                    isOpen ? "px-3" : "justify-center px-0",
                    isActive ? "bg-white/10 text-white shadow-lg" : `text-muted-foreground hover:text-white ${item.hoverBg}`
                    )}
                >
                    <item.icon className={cn(
                        "w-5 h-5 min-w-5 transition-all duration-300", 
                        item.color, 
                        !isOpen && "group-hover:scale-110",
                        isActive && "drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                    )} />
                    
                    <span className={cn(
                        "whitespace-nowrap overflow-hidden transition-opacity",
                        // Logic animasi teks diperbaiki
                        isOpen ? "w-auto opacity-100 ml-1 duration-300 delay-100" : "w-0 opacity-0 ml-0 duration-0"
                    )}>
                        {item.name}
                    </span>

                    {/* BAR & GLOW (Perbaikan: Menggunakan Class Eksplisit) */}
                    {isActive && (
                        <div className={cn(
                            "absolute left-0 w-1 h-6 rounded-r-full",
                            item.barColor,    // BG Merah/Hijau pasti muncul
                            item.shadowColor  // Shadow berwarna pasti muncul
                        )} />
                    )}
                </button>
               );
            })}
          </nav>
        </div>
      </div>

      {/* --- FOOTER STATUS --- */}
      <div className={cn(
          "mt-auto border-t border-border/30 flex items-center transition-all duration-500",
          isOpen ? "p-4 justify-between" : "p-4 justify-center"
      )}>
         {isOpen ? (
             <div className="flex w-full items-center justify-between animate-fade-in">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {isPinned ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    <span className="whitespace-nowrap">{isPinned ? "Locked" : "Auto-Hide"}</span>
                </div>
                <div className="px-1.5 py-0.5 rounded border border-border bg-white/5 text-[10px] text-muted-foreground font-mono">
                    Ctrl+S
                </div>
             </div>
         ) : (
             <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
         )}
      </div>
      
    </div>
  );
}