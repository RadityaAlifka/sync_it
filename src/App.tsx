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
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 overflow-y-auto">
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                
                {/* Dashboard Utama */}
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Dashboard Spesifik Platform (Dynamic Route) */}
                <Route path="/library/:platform" element={<Dashboard />} />
                
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;