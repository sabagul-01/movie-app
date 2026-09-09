import { useEffect, useState } from 'react'
import { Search, Star, Film, AlertCircle } from 'lucide-react'
import './App.css'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const POPULAR_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
const SEARCH_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`
const POSTER_BASE = 'https://image.tmdb.org/t/p/w500'

function App() {
  const [movies, setMovies] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedTerm, setDebouncedTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(searchTerm.trim()), 400)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    if (!API_KEY) {
      setError('Missing TMDB API key. Add VITE_TMDB_API_KEY to your .env file.')
      setLoading(false)
      return
    }

    const controller = new AbortController()

    async function fetchMovies() {
      setLoading(true)
      setError('')

      const url = debouncedTerm
        ? `${SEARCH_URL}${encodeURIComponent(debouncedTerm)}`
        : POPULAR_URL

      try {
        const response = await fetch(url, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`)
        }

        const data = await response.json()
        setMovies(Array.isArray(data.results) ? data.results : [])
      } catch (err) {
        if (err.name === 'AbortError') return
        setError(err.message || 'Unable to load movies. Please try again.')
        setMovies([])
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchMovies()
    return () => controller.abort()
  }, [debouncedTerm])

  const heading = debouncedTerm
    ? `Results for “${debouncedTerm}”`
    : 'Popular movies'

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <Film size={28} aria-hidden="true" />
            <h1>CineScope</h1>
          </div>
          <label className="search" htmlFor="movie-search">
            <span className="sr-only">Search movies</span>
            <Search size={18} aria-hidden="true" />
            <input
              id="movie-search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search movies..."
              autoComplete="off"
            />
          </label>
        </div>
      </header>

      <main className="main">
        <div className="section-head">
          <h2>{heading}</h2>
          {!loading && !error && movies.length > 0 && (
            <p className="count">{movies.length} titles</p>
          )}
        </div>

        {loading && (
          <p className="status" role="status" aria-live="polite">
            Loading movies...
          </p>
        )}

        {error && !loading && (
          <div className="status status-error" role="alert">
            <AlertCircle size={20} aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && movies.length === 0 && (
          <p className="status" role="status">
            {debouncedTerm
              ? `No movies found for “${debouncedTerm}”. Try another title.`
              : 'No movies to display right now.'}
          </p>
        )}

        {!loading && !error && movies.length > 0 && (
          <ul className="grid">
            {movies.map((movie) => (
              <li key={movie.id} className="card">
                {movie.poster_path ? (
                  <img
                    src={`${POSTER_BASE}${movie.poster_path}`}
                    alt={`${movie.title} poster`}
                    className="poster"
                    loading="lazy"
                  />
                ) : (
                  <div className="poster poster-fallback" aria-hidden="true">
                    <Film size={40} />
                    <span>No poster</span>
                  </div>
                )}
                <div className="card-body">
                  <h3>{movie.title}</h3>
                  <p className="meta">
                    <span>{movie.release_date || 'Unknown date'}</span>
                    <span className="rating">
                      <Star size={14} aria-hidden="true" />
                      {typeof movie.vote_average === 'number'
                        ? movie.vote_average.toFixed(1)
                        : 'N/A'}
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}

export default App
