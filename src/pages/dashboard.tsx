import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { RefreshCw, Music, PlusCircle, ArrowRight } from "lucide-react";
import { authService } from "../services/auth";

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
  tracks: { total: number };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  // Cek status & ambil data
  const initDashboard = async () => {
    setLoading(true);
    try {
      const status = await authService.checkStatus();
      setIsConnected(status);

      if (status) {
        const data = await invoke<Playlist[]>("get_current_user_playlists");
        setPlaylists(data);
      } else {
        setPlaylists([]); // Kosongkan jika tidak connect
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-8 font-sans animate-fade-in">
      
      {/* HEADER */}
      <header className="flex justify-between items-center mb-10 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-muted-foreground">Pusat sinkronisasi musikmu.</p>
        </div>
        
        {isConnected && (
            <button onClick={initDashboard} className="p-2 rounded-full bg-secondary hover:bg-muted text-white transition">
                <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            </button>
        )}
      </header>

      {/* CONTENT SWITCHER */}
      <main>
        {loading ? (
           <div className="text-muted-foreground">Memuat data...</div>
        ) : !isConnected ? (
          
          // --- EMPTY STATE / INSTRUCTION ---
          <div className="flex flex-col items-center justify-center py-16 text-center max-w-lg mx-auto">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                <Music className="w-10 h-10 text-muted-foreground opacity-50" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Belum ada akun terhubung</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Untuk melihat dan memindahkan playlist, kamu perlu menghubungkan akun layanan musikmu (Spotify atau YouTube) terlebih dahulu.
            </p>
            <button 
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
            >
              Atur Akun & Koneksi <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        ) : (
          
          // --- PLAYLIST GRID (Jika sudah connect) ---
          <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Playlist Spotify Kamu</h2>
                <span className="text-xs bg-spotify-green/20 text-spotify-green px-2 py-1 rounded">Live Sync</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {playlists.map((playlist) => (
                <div key={playlist.id} className="group bg-card hover:bg-[#282828] p-4 rounded-xl transition-all cursor-pointer">
                  <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-[#282828]">
                    {playlist.images[0]?.url && (
                        <img src={playlist.images[0].url} alt={playlist.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <h3 className="font-semibold text-white truncate">{playlist.name}</h3>
                  <p className="text-sm text-muted-foreground">{playlist.tracks.total} Lagu</p>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}