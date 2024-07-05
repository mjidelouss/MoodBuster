import { useState, useEffect } from 'react';
import MovieCard from '../MovieCard/MovieCard';

const API_KEY = '86cdb246bc2dfde7b16fa94055f4d2f5';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
}

interface MovieSuggestionProps {
  mood: string;
  genre: { id: number; name: string };
}

const moodToKeywords: { [key: string]: string } = {
  // ... (keep the existing mood to keywords mapping)
};

function MovieSuggestion({ mood, genre }: MovieSuggestionProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      setError(null);
      setMovies([]); // Clear previous results
      setCurrentIndex(0);

      try {
        const keywords = moodToKeywords[mood] || '';
        let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genre.id}&sort_by=popularity.desc`;
        
        if (keywords) {
          url += `&with_keywords=${encodeURIComponent(keywords)}`;
        }
        
        console.log('Fetching movies from:', url);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('API response:', data);
        
        if (data.results && data.results.length > 0) {
          setMovies(data.results);
        } else {
          // If no results, try again without keywords
          url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genre.id}&sort_by=popularity.desc`;
          console.log('Retrying without keywords:', url);
          const retryResponse = await fetch(url);
          const retryData = await retryResponse.json();
          console.log('Retry API response:', retryData);
          
          if (retryData.results && retryData.results.length > 0) {
            setMovies(retryData.results);
          } else {
            setError('No movies found for the selected genre. Please try a different combination.');
          }
        }
      } catch (e) {
        console.error('Error fetching movies:', e);
        setError('Failed to fetch movies. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [mood, genre]); // This effect will run whenever mood or genre changes

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length);
  };

  if (isLoading) {
    return <div className="text-center text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 dark:text-red-400">{error}</div>;
  }

  if (movies.length === 0) {
    return <div className="text-center text-gray-600 dark:text-gray-400">No movies found. Try a different mood or genre.</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
        Suggested movie for "{mood}" mood and {genre.name} genre:
      </h2>
      <MovieCard movie={movies[currentIndex]} />
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevious}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors dark:bg-gray-700 dark:hover:bg-gray-800"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors dark:bg-gray-700 dark:hover:bg-gray-800"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default MovieSuggestion;