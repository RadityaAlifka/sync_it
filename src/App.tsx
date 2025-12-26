import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { listen } from "@tauri-apps/api/event";
import { Sidebar } from "./components/Sidebar";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";

function App() {
  useEffect(() => {
    const unlisten = listen("spotify-connected", () => {
        console.log("Global Event: Spotify Connected");
    });
    return () => { unlisten.then(f => f()) };
  }, []);

  return (
    <BrowserRouter>
      {/* Container utama Flex Row */}
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        
        {/* Sidebar akan otomatis mendorong konten karena sifat flex */}
        <Sidebar />
        
        {/* Konten Kanan (Flex-1 akan mengisi sisa ruang) */}
        <div className="flex-1 overflow-y-auto relative transition-all duration-300">
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/library/:platform" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;