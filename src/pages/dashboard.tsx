import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Play } from "lucide-react";
import { Sidebar } from "../components/Sidebar"; // Pastikan path benar
import { Player } from "../components/Player";   // Pastikan path benar

// Tipe Data Playlist
interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
  tracks: { total: number };
}

export default function Dashboard() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await invoke<Playlist[]>("get_current_user_playlists");
        setPlaylists(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      
      {/* Area Tengah: Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR (Statis) */}
        <Sidebar />

        {/* MAIN CONTENT (Dinamis dari Rust) */}
        <div className="flex-1 bg-[#121212] h-full overflow-y-auto">
          {/* Header Gradient */}
          <div className="bg-gradient-to-b from-[#1a1a1a] to-[#121212] px-8 pt-16 pb-6">
             <h1 className="text-white text-3xl font-bold mb-1">Halo, User</h1>
             <p className="text-muted-foreground">Siap memindahkan playlistmu?</p>
          </div>

          <div className="px-8 pb-32">
            <section className="mb-12">
              <h2 className="text-white text-xl font-bold mb-6">Playlist Kamu</h2>
              
              {loading ? (
                <div className="text-muted-foreground">Mengambil data...</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {playlists.map((playlist) => (
                    <div
                      key={playlist.id}
                      className="group bg-[#181818] hover:bg-[#282828] rounded-lg p-4 transition-all duration-300 cursor-pointer"
                      onClick={() => alert(`Pilih playlist: ${playlist.name}`)}
                    >
                      <div className="relative mb-4 aspect-square shadow-lg">
                        {playlist.images[0]?.url ? (
                            <img
                            src={playlist.images[0].url}
                            alt={playlist.name}
                            className="w-full h-full object-cover rounded-md"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-800 rounded-md flex items-center justify-center text-xs text-gray-500">No Image</div>
                        )}
                        
                        {/* Tombol Play Hover (Hijau) */}
                        <button className="absolute bottom-2 right-2 w-12 h-12 bg-spotify-green rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:scale-105">
                          <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                        </button>
                      </div>

                      <h3 className="text-white font-bold truncate mb-1">{playlist.name}</h3>
                      <p className="text-[#a8a8a8] text-sm line-clamp-2">
                        {playlist.tracks.total} Lagu
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* PLAYER (Statis di Bawah) */}
      <Player />
      
    </div>
  );
}