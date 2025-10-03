import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function MoviePage() {
  const router = useRouter();
  const { slug } = router.query;

  const [movie, setMovie] = useState(null);
  const [activePlayer, setActivePlayer] = useState('earnvids');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/movies/${slug}`)
      .then(res => res.json())
      .then(data => {
        setMovie(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!movie || movie.error) return <div className="min-h-screen flex items-center justify-center text-white">Movie not found</div>;

  const players = {
    earnvids: movie.platforms.earnvids?.embed_url,
    streamhg: movie.platforms.streamhg?.embed_url,
    filemoon: movie.platforms.filemoon?.embed_url,
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6">{movie.title}</h1>

      <div className="w-full max-w-5xl aspect-video mb-4 bg-black rounded overflow-hidden">
        {players[activePlayer] ? (
          <iframe
            src={players[activePlayer]}
            title={`${movie.title} player`}
            width="100%"
            height="100%"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="text-center p-6">Player not available.</div>
        )}
      </div>

      <div className="flex space-x-4">
        {Object.keys(players).map(key => (
          <button
            key={key}
            className={`px-4 py-2 rounded ${
              activePlayer === key ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={() => setActivePlayer(key)}
          >
            {key.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
