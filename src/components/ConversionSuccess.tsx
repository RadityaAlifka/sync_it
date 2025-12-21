import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface ConversionSuccessProps {
  onOpenPlaylist: () => void;
}

export function ConversionSuccess({ onOpenPlaylist }: ConversionSuccessProps) {
  const [autoSync, setAutoSync] = useState(false);

  return (
    <div className="size-full bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-full max-w-md px-8">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-16 h-16 text-[#1db954]" />
        </div>

        {/* Success Message */}
        <div className="text-center mb-12">
          <h2 className="text-white mb-3">Your playlist is ready</h2>
          <p className="text-[#a8a8a8]">30 songs added to YouTube</p>
        </div>

        {/* Auto-sync Toggle */}
        <div className="bg-[#121212] border border-[#282828] rounded-lg p-6 mb-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <h4 className="text-white mb-1">Keep this playlist in sync</h4>
              <p className="text-[#a8a8a8] text-sm">
                New songs added in Spotify will appear automatically
              </p>
            </div>
            <button
              onClick={() => setAutoSync(!autoSync)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
                autoSync ? "bg-[#1db954]" : "bg-[#282828]"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                  autoSync ? "translate-x-[22px]" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Open Playlist Button */}
        <button
          onClick={onOpenPlaylist}
          className="w-full h-12 bg-[#1db954] hover:bg-[#1ed760] text-black rounded-lg transition-all duration-200 hover:scale-[1.02]"
        >
          Open playlist
        </button>
      </div>
    </div>
  );
}
