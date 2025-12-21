import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

function App() {
  const [status, setStatus] = useState("Memuat status...");
  // Default false, tapi nanti langsung dicek
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus(); // <--- 1. Cek status saat aplikasi baru dibuka

    const unlistenLogin = listen("spotify-connected", () => {
      setStatus("✅ BERHASIL LOGIN!");
      setIsLoggedIn(true);
      checkLoginStatus(); // Cek ulang untuk memastikan
    });

    const unlistenLogout = listen("spotify-logged-out", () => {
      setStatus("Siap.");
      setIsLoggedIn(false);
    });

    return () => {
      unlistenLogin.then((f) => f());
      unlistenLogout.then((f) => f());
    };
  }, []);

  // --- FUNGSI BARU UNTUK CEK STATUS ---
  async function checkLoginStatus() {
    try {
      // Tanya ke Rust: "Apakah ada file token?"
      const loggedIn = await invoke("check_auth_status");
      setIsLoggedIn(loggedIn as boolean);
      
      if (loggedIn) {
        setStatus("✅ Kembali terhubung (Sesi dipulihkan).");
      } else {
        setStatus("Siap. Silakan login.");
      }
    } catch (err) {
      console.error("Gagal cek status:", err);
    }
  }

  async function handleSpotifyLogin() {
    setStatus("Membuka browser login...");
    try {
      const authUrl = await invoke("login_spotify");
      window.location.href = authUrl as string;
    } catch (error) {
      setStatus("Error Login: " + String(error));
    }
  }

  async function handleLogout() {
    try {
      await invoke("logout_spotify");
      setIsLoggedIn(false);
      setStatus("Anda telah logout.");
    } catch (error) {
      setStatus("Gagal logout: " + String(error));
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white space-y-6">
      <h1 className="text-3xl font-bold">Sync It</h1>
      
      <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 min-w-[320px] text-center shadow-2xl">
        <p className="mb-6 text-gray-400 font-mono text-xs uppercase tracking-wide">{status}</p>

        {!isLoggedIn ? (
          <button 
            onClick={handleSpotifyLogin}
            className="w-full py-3 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-full transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            {/* Ikon Spotify Sederhana */}
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
            Login Spotify
          </button>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col items-center gap-2 mb-4">
               <div className="text-green-400 text-6xl drop-shadow-lg">🎉</div>
               <h2 className="text-xl font-semibold">Akun Terhubung</h2>
            </div>
            
            <div className="flex flex-col gap-3">
              <button className="w-full py-2 bg-blue-600 rounded-lg hover:bg-blue-500 text-white font-medium transition-colors cursor-pointer border border-blue-400">
                Lanjut ke YouTube →
              </button>
              
              {/* TOMBOL LOGOUT MUNCUL DI SINI */}
              <button 
                onClick={handleLogout}
                className="w-full py-2 bg-transparent border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all text-sm cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;