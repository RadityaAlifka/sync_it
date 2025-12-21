import { Play } from "lucide-react";

const playlists = [
  {
    id: 1,
    title: "Midnight Drive",
    description: "Late night vibes",
    image: "https://images.unsplash.com/photo-1677799562106-0e3edc7dce45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMG11c2ljJTIwdmlueWx8ZW58MXx8fHwxNzY1NTQwNjM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 2,
    title: "Live Sessions",
    description: "Feel the energy",
    image: "https://images.unsplash.com/photo-1656283384093-1e227e621fad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwY3Jvd2QlMjBtdXNpY3xlbnwxfHx8fDE3NjU2MDM1Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 3,
    title: "Indie Favorites",
    description: "Your go-to indie mix",
    image: "https://images.unsplash.com/photo-1512153129600-528cae82b06a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMG11c2ljJTIwYXJ0aXN0fGVufDF8fHx8MTc2NTYwNjcwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 4,
    title: "Jazz Lounge",
    description: "Smooth and sophisticated",
    image: "https://images.unsplash.com/photo-1710951403141-353d4e5c7cbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXp6JTIwbXVzaWMlMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NjU2MDkzNDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 5,
    title: "Electronic Pulse",
    description: "Beat driven",
    image: "https://images.unsplash.com/photo-1692176548571-86138128e36c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWMlMjBkanxlbnwxfHx8fDE3NjU1NTQzNzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 6,
    title: "Rock Legends",
    description: "Classic rock anthems",
    image: "https://images.unsplash.com/photo-1605004992659-832f10e0b374?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZCUyMGxpdmV8ZW58MXx8fHwxNzY1NTMwOTEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  }
];

export function MainContent() {
  return (
    <div className="flex-1 bg-[#121212] h-full overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#1a1a1a] to-[#121212] px-8 pt-16 pb-6">
        <h1 className="text-white mb-6">Good evening</h1>
      </div>

      {/* Content */}
      <div className="px-8 pb-32">
        {/* Featured Playlists */}
        <section className="mb-12">
          <h2 className="text-white mb-6">Made for you</h2>
          <div className="grid grid-cols-3 gap-6">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="group bg-[#181818] hover:bg-[#282828] rounded-lg p-4 transition-all duration-300 cursor-pointer"
              >
                <div className="relative mb-4">
                  <img
                    src={playlist.image}
                    alt={playlist.title}
                    className="w-full aspect-square object-cover rounded-md"
                  />
                  <button className="absolute bottom-2 right-2 w-12 h-12 bg-[#1db954] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:scale-105">
                    <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                  </button>
                </div>
                <h3 className="text-white mb-2">{playlist.title}</h3>
                <p className="text-[#a8a8a8]">{playlist.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
