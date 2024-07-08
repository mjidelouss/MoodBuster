import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MovieCard from '../MovieCard/MovieCard';

const API_KEY = '86cdb246bc2dfde7b16fa94055f4d2f5';

interface Media {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  overview: string;
  genres?: { id: number; name: string }[];
  runtime?: number;
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  created_by?: { name: string }[];
  credits?: {
    cast: { name: string }[];
    crew: { job: string; name: string }[];
  };
}

interface MovieSuggestionProps {
  mediaType: string;
  mood: string;
}

interface MoodMapping {
  keywords: number[];
  genres: number[];
}

const moodToMappingData: { [key: string]: MoodMapping } = {
  'Cozy and Comforting': {
    keywords: [10024], // cozy
    genres: [35, 10751] // comedy, family
  },
  'Adventure Craving': {
    keywords: [1365], // adventure
    genres: [12, 28] // adventure, action
  },
  'Heartwarming and Uplifting': {
    keywords: [9713], // heartwarming
    genres: [18, 10751] // drama, family
  },
  'Intellectually Stimulating': {
    keywords: [156205], // thought-provoking
    genres: [99, 36] // documentary, history
  },
  'Nostalgic and Sentimental': {
    keywords: [6054], // nostalgia
    genres: [18, 10749] // drama, romance
  },
  'Laugh Out Loud': {
    keywords: [9675], // hilarious
    genres: [35] // comedy
  },
  'Edge of Your Seat': {
    keywords: [10944], // suspense
    genres: [53, 80] // thriller, crime
  },
  'Mysteriously Intrigued': {
    keywords: [9725], // mystery
    genres: [9648, 80] // mystery, crime
  },
  'Feel-Good Escape': {
    keywords: [5615], // feel-good
    genres: [35, 10749] // comedy, romance
  },
  'Romantic and Dreamy': {
    keywords: [9748], // romantic
    genres: [10749] // romance
  },
  'Epic and Grandiose': {
    keywords: [4344], // epic
    genres: [12, 14] // adventure, fantasy
  },
  'Deep and Reflective': {
    keywords: [156218], // philosophical
    genres: [18] // drama
  },
  'Playful and Fun': {
    keywords: [9663], // fun
    genres: [35, 16] // comedy, animation
  },
  'Thrill Seeker': {
    keywords: [10663], // adrenaline
    genres: [28, 53] // action, thriller
  },
  'Inspirational and Motivating': {
    keywords: [165194], // inspirational
    genres: [18, 36] // drama, history
  },
  'Relaxed and Chill': {
    keywords: [245728], // laid-back
    genres: [35, 10402] // comedy, music
  },
  'Imaginative and Fantastical': {
    keywords: [9716], // fantasy
    genres: [14, 878] // fantasy, science fiction
  },
  'Somber and Thought-Provoking': {
    keywords: [15096], // melancholy
    genres: [18] // drama
  },
  'Lighthearted and Breezy': {
    keywords: [246716], // lighthearted
    genres: [35, 10751] // comedy, family
  },
  'Mind-Bending and Twisty': {
    keywords: [10052], // plot-twist
    genres: [53, 9648] // thriller, mystery
  },
};

function MovieSuggestion({ mediaType, mood }: MovieSuggestionProps) {
  const [media, setMedia] = useState<Media[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      setIsLoading(true);
      setError(null);
      setMedia([]);
      setCurrentIndex(0);
    
      try {
        const moodMapping = moodToMappingData[mood];
        if (!moodMapping) {
          throw new Error(`No mapping found for mood: ${mood}`);
        }
    
        const { keywords, genres } = moodMapping;
        let url = `https://api.themoviedb.org/3/discover/${mediaType === 'Movie' ? 'movie' : 'tv'}?api_key=${API_KEY}`;
    
        // Start with both keywords and genres
        if (keywords.length > 0) {
          url += `&with_keywords=${keywords.join('|')}`;
        }
        if (genres.length > 0) {
          url += `&with_genres=${genres.join(',')}`;
        }
    
        // Add sorting and filtering options
        url += '&sort_by=popularity.desc&vote_count.gte=100';
    
        if (mediaType === 'Anime') {
          url += '&with_keywords=210024'; // Keyword ID for anime
        }
    
        let data = await fetchFromApi(url);
    
        // If no results, try with only genres
        if (data.results.length === 0 && genres.length > 0) {
          url = `https://api.themoviedb.org/3/discover/${mediaType === 'Movie' ? 'movie' : 'tv'}?api_key=${API_KEY}&with_genres=${genres.join(',')}&sort_by=popularity.desc&vote_count.gte=100`;
          data = await fetchFromApi(url);
        }
    
        // If still no results, try with only keywords
        if (data.results.length === 0 && keywords.length > 0) {
          url = `https://api.themoviedb.org/3/discover/${mediaType === 'Movie' ? 'movie' : 'tv'}?api_key=${API_KEY}&with_keywords=${keywords.join('|')}&sort_by=popularity.desc&vote_count.gte=100`;
          data = await fetchFromApi(url);
        }
    
        // If still no results, fetch popular titles for the media type
        if (data.results.length === 0) {
          url = `https://api.themoviedb.org/3/${mediaType === 'Movie' ? 'movie' : 'tv'}/popular?api_key=${API_KEY}`;
          data = await fetchFromApi(url);
        }
    
        if (data.results && data.results.length > 0) {
          const detailedMedia = await Promise.all(
            data.results.map(async (item: Media) => {
              const detailUrl = `https://api.themoviedb.org/3/${mediaType === 'Movie' ? 'movie' : 'tv'}/${item.id}?api_key=${API_KEY}&append_to_response=credits`;
              const detailData = await fetchFromApi(detailUrl);
              return { ...item, ...detailData };
            })
          );
          setMedia(detailedMedia);
        } else {
          setError(`No ${mediaType.toLowerCase()} found for the selected mood. Please try a different mood.`);
        }
      } catch (e) {
        console.error('Error fetching media:', e);
        setError(`Failed to fetch ${mediaType.toLowerCase()}. Please try again.`);
      } finally {
        setIsLoading(false);
      }
    };
    
    const fetchFromApi = async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    };

    fetchMedia();
  }, [mediaType, mood]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % media.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + media.length) % media.length);
  };

  if (isLoading) {
    return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-600 dark:text-gray-400">Loading...</motion.div>;
  }

  if (error) {
    return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-red-600 dark:text-red-400">{error}</motion.div>;
  }

  if (media.length === 0) {
    return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-600 dark:text-gray-400">No {mediaType.toLowerCase()} found. Try a different mood.</motion.div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4 font-acme">
        Suggested {mediaType.toLowerCase()} for "<span className='text-tahiti'>{mood}</span>" mood:
      </h2>
      <AnimatePresence mode="wait">
        <motion.div
          key={media[currentIndex].id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          <MovieCard media={media[currentIndex]} mediaType={mediaType} />
        </motion.div>
      </AnimatePresence>
      <motion.div 
        className="flex justify-between mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          onClick={handlePrevious}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors dark:bg-gray-700 dark:hover:bg-gray-800 font-eater"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Previous
        </motion.button>
        <motion.button
          onClick={handleNext}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors dark:bg-gray-700 dark:hover:bg-gray-800 font-eater"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Next
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default MovieSuggestion;