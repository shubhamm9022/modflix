import { useState, useEffect } from 'react';

export default function Admin() {
  const [title, setTitle] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [uploading, setUploading] = useState(false);

  async function fetchMovies(page = 1) {
    const res = await fetch(`/api/admin/list?page=${page}`);
    const data = await res.json();
    setMovies(data.movies);
    setTotalPages(data.pages);
  }

  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  async function handleUpload(e) {
    e.preventDefault();
    setUploading(true);
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, driveLink }),
    });
    const data = await res.json();
    alert(data.msg || data.error);
    setTitle('');
    setDriveLink('');
    setUploading(false);
    fetchMovies(page);
  }

  function copyLink(slug) {
    const fullUrl = `${process.env.NEXT_PUBLIC_SITE_BASE_URL}/watch/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    alert('Link copied: ' + fullUrl);
  }

  return (
    <div className="min-h-screen p-4 bg-gray-900 text-white">
      <h1 className="text-4xl mb-6 font-bold">Admin Panel</h1>
      <form onSubmit={handleUpload} className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Movie Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />
        <input
          type="url"
          placeholder="Google Drive Link"
          value={driveLink}
          onChange={e => setDriveLink(e.target.value)}
          required
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />
        <button disabled={uploading} className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50">
          {uploading ? 'Uploading...' : 'Upload Movie'}
        </button>
      </form>

      <h2 className="text-2xl mb-4">Uploaded Movies</h2>
      <table className="w-full text-left border-collapse border border-gray-700">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-2 border border-gray-700">Title</th>
            <th className="p-2 border border-gray-700">Drive Link</th>
            <th className="p-2 border border-gray-700">Movie Page</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie._id} className="border border-gray-700">
              <td className="p-2">{movie.title}</td>
              <td className="p-2 truncate max-w-xs"><a href={movie.driveLink} target="_blank" rel="noreferrer" className="underline">{movie.driveLink}</a></td>
              <td className="p-2">
                <button
                  onClick={() => copyLink(movie.slug)}
                  className="text-indigo-400 hover:underline"
                >
                  Copy Link
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 space-x-2">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded bg-gray-700 disabled:opacity-50">Prev</button>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded bg-gray-700 disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}
