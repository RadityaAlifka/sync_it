import { Music } from "lucide-react";

interface PlaylistDetectedProps {
  onConvert: () => void;
}

export function PlaylistDetected({ onConvert }: PlaylistDetectedProps) {
  // Mock playlist data
  const playlist = {
    name: "Chill Vibes",
    coverUrl: "https://images.unsplash.com/photo-1677799562106-0e3edc7dce45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMG11c2ljJTIwdmlueWx8ZW58MXx8fHwxNzY1NTQwNjM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    trackCount: 42
  };

  return (
    <div className="size-full bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-full max-w-md px-8">
        {/* Label */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 text-[#1db954] text-sm">
            <Music className="w-4 h-4" />
            Spotify playlist detected
          </span>
        </div>

        {/* Playlist Card */}
        <div className="bg-[#121212] border border-[#282828] rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            {/* Cover Image */}
            <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-[#282828]">
              <img
                src={playlist.coverUrl}
                alt={playlist.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Playlist Info */}
            <div className="flex-1 min-w-0 pt-2">
              <h2 className="text-white mb-2 truncate">{playlist.name}</h2>
              <p className="text-[#a8a8a8]">
                {playlist.trackCount} tracks
              </p>
            </div>
          </div>
        </div>

        {/* Convert Button */}
        <button
          onClick={onConvert}
          className="w-full h-12 bg-[#1db954] hover:bg-[#1ed760] text-black rounded-lg transition-all duration-200 hover:scale-[1.02]"
        >
          Convert to YouTube
        </button>
      </div>
    </div>
  );
}
