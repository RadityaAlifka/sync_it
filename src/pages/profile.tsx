import { useEffect, useState } from "react";
import { authService } from "../services/auth";
import { Music, Youtube, LogOut, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";

export default function Profile() {
  const [spotifyStatus, setSpotifyStatus] = useState(false);
  const [youtubeStatus, setYoutubeStatus] = useState(false); // Placeholder untuk nanti
  const [loading, setLoading] = useState(false);

  // Cek status saat halaman dibuka
  useEffect(() => {
    checkConnections();
  }, []);

  const checkConnections = async () => {
    const spotify = await authService.checkStatus();
    setSpotifyStatus(spotify);
    // setYoutubeStatus(await youtubeService.checkStatus()); // Nanti diimplementasikan
  };

  const handleSpotifyConnect = async () => {
    setLoading(true);
    try {
      if (spotifyStatus) {
        // Jika sudah connect, fungsinya jadi Logout
        await authService.logout();
        setSpotifyStatus(false);
      } else {
        // Jika belum, fungsinya Login
        await authService.login();
        // Kita tidak reload halaman, cukup cek status lagi nanti via listener atau manual
      }
    } catch (e) {
      alert("Gagal koneksi: " + e);
    } finally {
      setLoading(false);
      checkConnections();
    }
  };

  const handleYoutubeConnect = () => {
    alert("Fitur Sinkronisasi YouTube akan segera hadir! 🚀");
  };

  return (
    <div className="p-8 min-h-screen bg-background text-foreground animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">Pengaturan Akun</h1>
      <p className="text-muted-foreground mb-8">Kelola akun musik yang ingin disinkronisasi.</p>

      <div className="grid gap-6 max-w-2xl">
        
        {/* --- SPOTIFY CARD --- */}
        <div className="bg-card border border-border rounded-xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", spotifyStatus ? "bg-spotify-green/20" : "bg-muted")}>
              <Music className={cn("w-6 h-6", spotifyStatus ? "text-spotify-green" : "text-muted-foreground")} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Spotify</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                {spotifyStatus ? (
                  <span className="text-spotify-green flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Terhubung</span>
                ) : (
                  <span className="text-muted-foreground flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Belum terhubung</span>
                )}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleSpotifyConnect}
            disabled={loading}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-all text-sm border",
              spotifyStatus 
                ? "border-red-900/50 text-red-400 hover:bg-red-900/20" 
                : "bg-spotify-green text-black hover:bg-spotify-hover border-transparent"
            )}
          >
            {loading ? "Memproses..." : spotifyStatus ? "Disconnect" : "Connect"}
          </button>
        </div>

        {/* --- YOUTUBE CARD --- */}
        <div className="bg-card border border-border rounded-xl p-6 flex items-center justify-between opacity-80">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <Youtube className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">YouTube Music</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                {youtubeStatus ? (
                   <span className="text-green-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Terhubung</span>
                ) : (
                   <span className="text-muted-foreground flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Belum terhubung</span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={handleYoutubeConnect}
            className="px-4 py-2 rounded-lg font-medium transition-all text-sm border border-border bg-secondary hover:bg-muted text-foreground"
          >
            {youtubeStatus ? "Disconnect" : "Connect"}
          </button>
        </div>

      </div>
    </div>
  );
}