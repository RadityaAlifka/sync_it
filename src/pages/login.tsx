import { useState } from "react";
import { Music2 } from "lucide-react";
import { authService } from "../services/auth";
import { cn } from "../lib/utils"; 

export default function Login() {
  const [loading, setLoading] = useState(false);

  const handleSpotifyConnect = async () => {
    setLoading(true);
    try {
      const url = await authService.login();
      window.location.href = url;
    } catch (err) {
      alert("Error: " + err); 
      setLoading(false);
    }
  };

  return (
    <div className="size-full min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md px-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-16 h-16 rounded-full bg-spotify-green flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(29,185,84,0.3)]">
            <Music2 className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-foreground text-3xl font-bold mb-3">Sync It</h1>
        </div>

        {/* Headline */}
        <div className="text-center mb-12">
          <h2 className="text-foreground text-xl font-medium mb-3">Pindahkan playlist dengan mudah</h2>
          <p className="text-muted-foreground">
            Hubungkan akun musikmu untuk memulai
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 mb-8">
          <button
            onClick={handleSpotifyConnect}
            disabled={loading}
            className={cn(
                "w-full h-12 bg-spotify-green hover:bg-[#1ed760] text-black font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-3",
                loading && "opacity-70 cursor-not-allowed"
            )}
          >
             {/* Icon Spotify SVG */}
             <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
             {loading ? "Menghubungkan..." : "Masuk dengan Spotify"}
          </button>
          
          <button disabled className="w-full h-12 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-all flex items-center justify-center gap-3 opacity-50 cursor-not-allowed">
             <span>Masuk dengan Google (Segera)</span>
          </button>
        </div>
      </div>
    </div>
  );
}