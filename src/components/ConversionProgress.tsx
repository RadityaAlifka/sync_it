import { useEffect, useState } from "react";

interface ConversionProgressProps {
  onComplete: () => void;
}

export function ConversionProgress({ onComplete }: ConversionProgressProps) {
  const totalSongs = 30;
  const [currentSong, setCurrentSong] = useState(0);
  const progress = (currentSong / totalSongs) * 100;

  useEffect(() => {
    // Simulate conversion progress
    const interval = setInterval(() => {
      setCurrentSong((prev) => {
        if (prev >= totalSongs) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return totalSongs;
        }
        return prev + 1;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete, totalSongs]);

  return (
    <div className="size-full bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-full max-w-md px-8">
        {/* Headline */}
        <div className="text-center mb-12">
          <h2 className="text-white">Moving your playlist</h2>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full h-1.5 bg-[#282828] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1db954] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Status Text */}
        <div className="text-center">
          <p className="text-[#a8a8a8]">
            {currentSong} of {totalSongs} songs added
          </p>
        </div>
      </div>
    </div>
  );
}
