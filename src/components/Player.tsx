import { Heart, Shuffle, SkipBack, Play, SkipForward, Repeat, Mic2, ListMusic, Volume2 } from "lucide-react";
import { useState } from "react";

export function Player() {
  const [progress, setProgress] = useState(45);
  const [volume, setVolume] = useState(70);

  return (
    <div className="h-[90px] bg-[#181818] border-t border-[#282828] flex items-center justify-between px-4">
      {/* Currently Playing */}
      <div className="flex items-center gap-4 w-[30%]">
        <div className="w-14 h-14 bg-[#282828] rounded-md overflow-hidden flex-shrink-0">
          <img
            src="https://images.unsplash.com/photo-1677799562106-0e3edc7dce45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMG11c2ljJTIwdmlueWx8ZW58MXx8fHwxNzY1NTQwNjM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Now playing"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-white truncate">Midnight Dreams</h4>
          <p className="text-[#a8a8a8] text-sm truncate">The Wanderers</p>
        </div>
        <button className="text-[#a8a8a8] hover:text-white transition-colors">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {/* Player Controls */}
      <div className="flex flex-col items-center gap-2 w-[40%] max-w-[722px]">
        <div className="flex items-center gap-4">
          <button className="text-[#a8a8a8] hover:text-white transition-colors">
            <Shuffle className="w-4 h-4" />
          </button>
          <button className="text-[#a8a8a8] hover:text-white transition-colors">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform">
            <Play className="w-4 h-4 text-black fill-black ml-0.5" />
          </button>
          <button className="text-[#a8a8a8] hover:text-white transition-colors">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
          <button className="text-[#a8a8a8] hover:text-white transition-colors">
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-[#a8a8a8] w-10 text-right">1:23</span>
          <div className="flex-1 h-1 bg-[#4d4d4d] rounded-full overflow-hidden group cursor-pointer">
            <div
              className="h-full bg-[#a8a8a8] group-hover:bg-[#1db954] transition-colors relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <span className="text-xs text-[#a8a8a8] w-10">3:04</span>
        </div>
      </div>

      {/* Volume and Options */}
      <div className="flex items-center justify-end gap-3 w-[30%]">
        <button className="text-[#a8a8a8] hover:text-white transition-colors">
          <Mic2 className="w-4 h-4" />
        </button>
        <button className="text-[#a8a8a8] hover:text-white transition-colors">
          <ListMusic className="w-4 h-4" />
        </button>
        <button className="text-[#a8a8a8] hover:text-white transition-colors">
          <Volume2 className="w-4 h-4" />
        </button>
        <div className="w-24 h-1 bg-[#4d4d4d] rounded-full overflow-hidden group cursor-pointer">
          <div
            className="h-full bg-[#a8a8a8] group-hover:bg-white transition-colors relative"
            style={{ width: `${volume}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </div>
  );
}
