import { Home, Search, Library, Plus, Heart } from "lucide-react";

export function Sidebar() {
  return (
    <div className="w-[280px] bg-black h-full flex flex-col p-6 gap-6">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-[#1db954]" />
        <h1 className="text-white">Melodia</h1>
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-col gap-4">
        <a href="#" className="flex items-center gap-4 text-white hover:text-white/90 transition-colors">
          <Home className="w-6 h-6" />
          <span>Home</span>
        </a>
        <a href="#" className="flex items-center gap-4 text-[#a8a8a8] hover:text-white transition-colors">
          <Search className="w-6 h-6" />
          <span>Search</span>
        </a>
        <a href="#" className="flex items-center gap-4 text-[#a8a8a8] hover:text-white transition-colors">
          <Library className="w-6 h-6" />
          <span>Your Library</span>
        </a>
      </nav>

      {/* Divider */}
      <div className="h-px bg-[#282828] my-2" />

      {/* Playlists */}
      <nav className="flex flex-col gap-4 flex-1">
        <a href="#" className="flex items-center gap-4 text-[#a8a8a8] hover:text-white transition-colors">
          <Plus className="w-6 h-6" />
          <span>Create Playlist</span>
        </a>
        <a href="#" className="flex items-center gap-4 text-[#a8a8a8] hover:text-white transition-colors">
          <Heart className="w-6 h-6" />
          <span>Liked Songs</span>
        </a>

        {/* Saved Playlists */}
        <div className="flex flex-col gap-3 mt-4 text-[#a8a8a8]">
          <a href="#" className="hover:text-white transition-colors">Chill Vibes</a>
          <a href="#" className="hover:text-white transition-colors">Workout Mix</a>
          <a href="#" className="hover:text-white transition-colors">Evening Jazz</a>
          <a href="#" className="hover:text-white transition-colors">Top Hits 2024</a>
          <a href="#" className="hover:text-white transition-colors">Focus Flow</a>
        </div>
      </nav>
    </div>
  );
}
