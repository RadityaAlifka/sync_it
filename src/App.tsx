import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { listen } from "@tauri-apps/api/event";
import { authService } from "./services/auth";

// Import Halaman yang sudah kita pisah
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();

    // Dengerin sinyal dari Rust (kalau login sukses via browser)
    const unlisten = listen("spotify-connected", () => {
      setIsAuthenticated(true);
    });

    // Dengerin sinyal logout
    const unlistenLogout = listen("spotify-logged-out", () => {
      setIsAuthenticated(false);
    });

    return () => {
      unlisten.then((f) => f());
      unlistenLogout.then((f) => f());
    };
  }, []);

  const checkAuth = async () => {
    try {
      const status = await authService.checkStatus();
      setIsAuthenticated(status);
    } catch (e) {
      console.error(e);
      setIsAuthenticated(false);
    }
  };

  // Tampilkan layar hitam saat sedang loading status (biar gak kedip)
  if (isAuthenticated === null) {
    return <div className="h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIKA ROUTING: */}
        
        {/* Kalau user buka root (/), cek status login */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
        />
        
        {/* Kalau user maksa buka /dashboard tapi belum login, tendang balik ke Login */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;