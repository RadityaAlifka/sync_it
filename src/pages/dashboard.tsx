import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { 
  RefreshCw, Music, ArrowRight, Youtube, LayoutGrid, 
  ListMusic, PlayCircle, Plus 
} from "lucide-react";
import { authService } from "../services/auth";
import { cn } from "../lib/utils";

// --- KOMPONEN LOGO CUSTOM ---
const SpotifyLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
  tracks: { total: number };
  source?: "spotify" | "youtube";
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { platform } = useParams(); 
  
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  // Stats logic
  const stats = {
    spotifyCount: playlists.filter(p => p.source === 'spotify').length,
    youtubeCount: playlists.filter(p => p.source === 'youtube').length,
    totalTracks: playlists.reduce((acc, curr) => acc + curr.tracks.total, 0)
  };

  // --- LOGIKA TEMA DINAMIS ---
  // Fungsi ini menentukan warna berdasarkan platform
  const getThemeStyles = () => {
    switch (platform) {
      case "spotify":
        return {
          title: "Spotify Library",
          icon: SpotifyLogo,
          // Warna Glow (Ambient)
          ambientColor: "from-spotify-green/10 via-background to-background",
          // Warna Running LED
          ledGradient: "from-transparent via-spotify-green to-transparent",
          // Warna Icon/Text
          accentColor: "text-spotify-green"
        };
      case "youtube":
        return {
          title: "YouTube Music",
          icon: Youtube,
          ambientColor: "from-red-600/10 via-background to-background",
          ledGradient: "from-transparent via-red-600 to-transparent",
          accentColor: "text-red-500"
        };
      default:
        return {
          title: "Library Overview",
          icon: LayoutGrid,
          // Default ungu gelap (Netral tapi elegan)
          ambientColor: "from-indigo-900/15 via-background to-background",
          ledGradient: "from-transparent via-indigo-500 to-transparent",
          accentColor: "text-white"
        };
    }
  };

  const theme = getThemeStyles();
  const PageIcon = theme.icon;

  const initDashboard = async () => {
    setLoading(true);
    try {
      const status = await authService.checkStatus();
      setIsConnected(status);

      if (status) {
        const spotifyData = await invoke<Playlist[]>("get_current_user_playlists");
        const taggedSpotify = spotifyData.map(p => ({ ...p, source: "spotify" as const }));

        if (platform === "spotify") {
            setPlaylists(taggedSpotify);
        } else if (platform === "youtube") {
            setPlaylists([]); 
        } else {
            setPlaylists(taggedSpotify); 
        }
      } else {
        setPlaylists([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initDashboard();
  }, [platform]); 

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden font-sans">
      
      {/* --- EFEK VISUAL BACKGROUND --- */}
      
      {/* 1. Running LED Line (Garis atas bergerak) */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r animate-running-led transition-all duration-1000",
        theme.ledGradient
      )} />

      {/* 2. Ambient Glow (Cahaya Latar Belakang) */}
      {/* Menggunakan inset-0 dan gradient radial besar untuk efek smooth */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-b opacity-100 transition-all duration-1000 ease-in-out pointer-events-none",
        theme.ambientColor
      )} />
      
      {/* --- KONTEN UTAMA (Harus z-10 agar di atas background) --- */}
      <div className="relative z-10 p-8 animate-fade-in">
        
        {/* HEADER */}
        <header className="flex justify-between items-center mb-8 pb-6 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg bg-white/5 backdrop-blur-sm transition-colors duration-500", theme.accentColor)}>
              <PageIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white capitalize">{theme.title}</h1>
              <p className="text-muted-foreground text-sm">
                  {platform ? `Koleksi dari ${platform}` : "Ringkasan seluruh musikmu"}
              </p>
            </div>
          </div>
          
          {isConnected && (
              <button onClick={initDashboard} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition shadow-sm" title="Refresh Data">
                  <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
              </button>
          )}
        </header>

        {/* MAIN CONTENT */}
        <main>
          {loading && playlists.length === 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-64 bg-white/5 animate-pulse rounded-xl"></div>
                ))}
            </div>
          ) : !isConnected ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <LayoutGrid className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Selamat Datang di Sync It</h2>
              <p className="text-muted-foreground mb-8 max-w-md">
                  Hubungkan akun musikmu untuk mulai mengelola dan memindahkan playlist antar platform.
              </p>
              <button onClick={() => navigate("/profile")} className="bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition shadow-lg hover:shadow-white/20">
                Hubungkan Akun
              </button>
            </div>
          ) : !platform ? (

            // OVERVIEW
            <div className="flex flex-col gap-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Card Spotify */}
                  <div 
                      onClick={() => navigate('/library/spotify')}
                      className="relative overflow-hidden bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 group hover:border-spotify-green/50 cursor-pointer transition-all duration-500"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                        <SpotifyLogo className="w-24 h-24 text-spotify-green" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-full bg-spotify-green/20 flex items-center justify-center">
                              <SpotifyLogo className="w-4 h-4 text-spotify-green" />
                          </div>
                          <span className="font-semibold text-spotify-green">Spotify</span>
                        </div>
                        <h3 className="text-4xl font-bold text-white mb-1">{stats.spotifyCount}</h3>
                        <p className="text-sm text-muted-foreground">Playlist Terhubung</p>
                    </div>
                  </div>

                  {/* Card YouTube */}
                  <div 
                      onClick={() => navigate('/library/youtube')}
                      className="relative overflow-hidden bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 group hover:border-red-500/50 cursor-pointer transition-all duration-500"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                        <Youtube className="w-24 h-24 text-red-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                              <Youtube className="w-4 h-4 text-red-500" />
                          </div>
                          <span className="font-semibold text-red-500">YouTube Music</span>
                        </div>
                        <h3 className="text-4xl font-bold text-white mb-1">{stats.youtubeCount}</h3>
                        <p className="text-sm text-muted-foreground">Playlist Terhubung</p>
                    </div>
                  </div>

                  {/* Card Total */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900/20 to-purple-900/20 bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <ListMusic className="w-24 h-24 text-indigo-400" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                              <ListMusic className="w-4 h-4 text-indigo-400" />
                          </div>
                          <span className="font-semibold text-indigo-400">Total Koleksi</span>
                        </div>
                        <h3 className="text-4xl font-bold text-white mb-1">{stats.totalTracks.toLocaleString()}</h3>
                        <p className="text-sm text-muted-foreground">Total Lagu Tersimpan</p>
                    </div>
                  </div>
              </div>

              {/* Recent Added */}
              <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Baru Ditambahkan</h2>
                    <button onClick={() => navigate('/library/spotify')} className="text-sm text-muted-foreground hover:text-white flex items-center gap-2 transition-colors group">
                      Lihat Semua <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    <div className="flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/10 hover:border-white/20 rounded-xl cursor-pointer p-4 group transition-colors">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Plus className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">New Sync</span>
                    </div>

                    {playlists.slice(0, 4).map((playlist) => (
                      <div key={playlist.id} className="group bg-card/50 hover:bg-white/10 p-3 rounded-xl transition-all cursor-pointer border border-transparent hover:border-white/10 shadow-sm hover:shadow-lg backdrop-blur-sm">
                        <div className="relative aspect-square mb-3 overflow-hidden rounded-lg bg-[#282828] shadow-md">
                          {playlist.images[0]?.url ? (
                              <img src={playlist.images[0].url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={playlist.name} />
                          ) : <div className="w-full h-full bg-muted flex items-center justify-center"><Music className="opacity-20"/></div>}
                          
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                              <PlayCircle className="w-10 h-10 text-white drop-shadow-xl hover:scale-110 transition-transform" />
                          </div>
                        </div>
                        <h4 className="font-semibold text-white truncate text-sm">{playlist.name}</h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          {playlist.source === 'spotify' && <SpotifyLogo className="w-3 h-3 text-spotify-green" />}
                          <p className="text-xs text-muted-foreground">{playlist.tracks.total} Lagu</p>
                        </div>
                      </div>
                    ))}
                  </div>
              </div>
            </div>
          ) : playlists.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-70">
                <PageIcon className="w-16 h-16 mb-4 text-muted-foreground opacity-30" />
                <h3 className="text-xl font-semibold mb-2">
                    {platform === 'youtube' ? "Belum Terhubung ke YouTube" : "Tidak ada playlist"}
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    {platform === 'youtube' 
                      ? "Fitur sinkronisasi YouTube Music sedang dalam pengembangan." 
                      : "Playlist kamu kosong di platform ini."}
                </p>
            </div>
          ) : (
            // Full Grid
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {playlists.map((playlist) => (
                <div key={playlist.id} className="group bg-card/50 hover:bg-white/10 p-4 rounded-xl transition-all cursor-pointer border border-transparent hover:border-white/10 hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm">
                  <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-[#282828] shadow-md">
                    {playlist.images[0]?.url ? (
                        <img src={playlist.images[0].url} alt={playlist.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Music /></div>
                    )}
                    {playlist.source === 'spotify' && (
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md p-1.5 rounded-full shadow-lg">
                            <SpotifyLogo className="w-3 h-3 text-spotify-green" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full hover:scale-105 transition-transform">
                          Pilih
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-white truncate">{playlist.name}</h3>
                  <p className="text-sm text-muted-foreground">{playlist.tracks.total} Lagu</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}