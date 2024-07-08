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
}

interface MovieSuggestionProps {
  mediaType: string;
  mood: string;
  genre: { id: number; name: string };
}

const moodToKeywordId: { [key: string]: number } = {
  'Cozy and Comforting': 10024, // cozy
  'Adventure Craving': 1365,   // adventure
  'Heartwarming and Uplifting': 9713, // heartwarming
  'Intellectually Stimulating': 156205, // thought-provoking
  'Nostalgic and Sentimental': 6054, // nostalgia
  'Laugh Out Loud': 9675, // hilarious
  'Edge of Your Seat': 10944, // suspense
  'Mysteriously Intrigued': 9725, // mystery
  'Feel-Good Escape': 5615, // feel-good
  'Romantic and Dreamy': 9748, // romantic
  'Epic and Grandiose': 4344, // epic
  'Deep and Reflective': 156218, // philosophical
  'Playful and Fun': 9663, // fun
  'Thrill Seeker': 10663, // adrenaline
  'Inspirational and Motivating': 165194, // inspirational
  'Relaxed and Chill': 245728, // laid-back
  'Imaginative and Fantastical': 9716, // fantasy
  'Somber and Thought-Provoking': 15096, // melancholy
  'Lighthearted and Breezy': 246716, // lighthearted
  'Mind-Bending and Twisty': 10052, // plot-twist
};

function MovieSuggestion({ mediaType, mood, genre }: MovieSuggestionProps) {
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
        const keywordId = moodToKeywordId[mood];
        let url = `https://api.themoviedb.org/3/discover/${mediaType === 'Movie' ? 'movie' : 'tv'}?api_key=${API_KEY}&with_genres=${genre.id}`;
        
        if (keywordId) {
          url += `&with_keywords=${keywordId}`;
        }
        
        if (mediaType === 'Anime') {
          url += '&with_keywords=210024'; // Keyword ID for anime
        }
        
        console.log('Fetching media from:', url); // For debugging
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          setMedia(data.results);
        } else {
          setError(`No ${mediaType.toLowerCase()} found for the selected mood and genre. Please try a different combination.`);
        }
      } catch (e) {
        console.error('Error fetching media:', e);
        setError(`Failed to fetch ${mediaType.toLowerCase()}. Please try again.`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedia();
  }, [mediaType, mood, genre]);

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
    return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-600 dark:text-gray-400">No {mediaType.toLowerCase()} found. Try a different mood or genre.</motion.div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4 font-acme">
        Suggested {mediaType.toLowerCase()} for "<span className='text-tahiti'>{mood}</span>" mood and <span className='text-tahiti'>{genre.name}</span> genre:
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