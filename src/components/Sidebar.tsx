import { Home, Settings, Music2, Youtube, ListMusic, LayoutGrid } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Menu Utama
  const mainItems = [
    { name: "Overview", icon: LayoutGrid, path: "/dashboard" },
    { name: "Settings", icon: Settings, path: "/profile" },
  ];

  // Menu Platform (Dynamic Routing)
  const platformItems = [
    { name: "Spotify", icon: Music2, path: "/library/spotify", color: "text-spotify-green" },
    { name: "YouTube Music", icon: Youtube, path: "/library/youtube", color: "text-red-500" },
  ];

  return (
    <div className="w-[260px] bg-black h-full flex flex-col p-4 gap-6 border-r border-border shrink-0">
      
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mt-2">
        <div className="w-8 h-8 rounded-full bg-spotify-green flex items-center justify-center shadow-[0_0_15px_rgba(29,185,84,0.3)]">
            <Music2 className="w-5 h-5 text-black" />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">Sync It</h1>
      </div>

      {/* Main Menu */}
      <div className="flex flex-col gap-1">
        <p className="px-4 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Menu</p>
        <nav className="flex flex-col gap-1">
            {mainItems.map((item) => (
            <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium",
                location.pathname === item.path
                    ? "bg-white/10 text-white" 
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
            >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
            </button>
            ))}
        </nav>
      </div>

      {/* Platform Menu */}
      <div className="flex flex-col gap-1">
        <p className="px-4 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Platforms</p>
        <nav className="flex flex-col gap-1">
            {platformItems.map((item) => (
            <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium group",
                location.pathname === item.path
                    ? "bg-white/10 text-white" 
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
            >
                {/* Icon dengan warna spesifik */}
                <item.icon className={cn("w-4 h-4 transition-colors", item.color, "group-hover:opacity-100 opacity-80")} />
                <span>{item.name}</span>
            </button>
            ))}
        </nav>
      </div>

      {/* Playlist Cepat (Hardcoded contoh visual) */}
      <div className="mt-auto flex flex-col gap-1">
         <div className="h-px bg-border my-2 mx-2" />
         <button className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-white transition-colors">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <ListMusic className="w-3 h-3 text-white" />
            </div>
            <span className="truncate">Liked Songs</span>
         </button>
      </div>
      
    </div>
  );
}