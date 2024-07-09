import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MediaCard from '../MediaCard/MediaCard';

const API_KEY = '86cdb246bc2dfde7b16fa94055f4d2f5';
const API_BOOK_KEY = 'AIzaSyCU8JZZ88PS62pmnQqV_7tgBuf9cWOh9d8';
const GOOGLE_BOOKS_API_BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

interface Media {
  id: string | number;
  title?: string;
  name?: string;
  poster_path?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  overview?: string;
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
  authors?: string[];
  publishedDate?: string;
  description?: string;
  categories?: string[];
  averageRating?: number;
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
  infoLink?: string;
}

interface MediaSuggestionProps {
  mediaType: string;
  mood: string;
}

interface MoodMapping {
  keywords: number[];
  genres: number[];
}

const moodToBookKeywords: { [key: string]: string[] } = {
  'Cozy and Comforting': ['cozy', 'comfort reads'],
  'Adventure Craving': ['adventure', 'action'],
  'Heartwarming and Uplifting': ['heartwarming', 'uplifting'],
  'Intellectually Stimulating': ['intellectual', 'thought-provoking'],
  'Nostalgic and Sentimental': ['nostalgia', 'classic'],
  'Laugh Out Loud': ['humor', 'comedy'],
  'Edge of Your Seat': ['thriller', 'suspense'],
  'Mysteriously Intrigued': ['mystery', 'detective'],
  'Feel-Good Escape': ['feel-good', 'escapism'],
  'Romantic and Dreamy': ['romance', 'love story'],
  'Epic and Grandiose': ['epic', 'saga'],
  'Deep and Reflective': ['philosophical', 'reflective'],
  'Playful and Fun': ['playful', 'fun'],
  'Thrill Seeker': ['thriller', 'action'],
  'Inspirational and Motivating': ['inspirational', 'self-help'],
  'Relaxed and Chill': ['relaxing', 'light read'],
  'Imaginative and Fantastical': ['fantasy', 'science fiction'],
  'Somber and Thought-Provoking': ['literary fiction', 'drama'],
  'Lighthearted and Breezy': ['lighthearted', 'feel-good'],
  'Mind-Bending and Twisty': ['psychological thriller', 'twist ending']
};

const moodToMappingData: { [key: string]: MoodMapping } = {
  'Cozy and Comforting': {
    keywords: [10024],
    genres: [35, 10751]
  },
  'Adventure Craving': {
    keywords: [1365],
    genres: [12, 28]
  },
  'Heartwarming and Uplifting': {
    keywords: [9713],
    genres: [18, 10751]
  },
  'Intellectually Stimulating': {
    keywords: [156205],
    genres: [99, 36]
  },
  'Nostalgic and Sentimental': {
    keywords: [6054],
    genres: [18, 10749]
  },
  'Laugh Out Loud': {
    keywords: [9675],
    genres: [35]
  },
  'Edge of Your Seat': {
    keywords: [10944],
    genres: [53, 80]
  },
  'Mysteriously Intrigued': {
    keywords: [9725],
    genres: [9648, 80]
  },
  'Feel-Good Escape': {
    keywords: [5615],
    genres: [35, 10749]
  },
  'Romantic and Dreamy': {
    keywords: [9748],
    genres: [10749]
  },
  'Epic and Grandiose': {
    keywords: [4344],
    genres: [12, 14]
  },
  'Deep and Reflective': {
    keywords: [156218],
    genres: [18]
  },
  'Playful and Fun': {
    keywords: [9663],
    genres: [35, 16]
  },
  'Thrill Seeker': {
    keywords: [10663],
    genres: [28, 53]
  },
  'Inspirational and Motivating': {
    keywords: [165194],
    genres: [18, 36]
  },
  'Relaxed and Chill': {
    keywords: [245728],
    genres: [35, 10402]
  },
  'Imaginative and Fantastical': {
    keywords: [9716],
    genres: [14, 878]
  },
  'Somber and Thought-Provoking': {
    keywords: [15096],
    genres: [18]
  },
  'Lighthearted and Breezy': {
    keywords: [246716],
    genres: [35, 10751]
  },
  'Mind-Bending and Twisty': {
    keywords: [10052],
    genres: [53, 9648]
  },
};

function MediaSuggestion({ mediaType, mood }: MediaSuggestionProps) {
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
        if (mediaType === 'Book') {
          const books = await fetchBooksByMood(mood);
          console.log('Fetched books:', books);
          if (books && books.length > 0) {
            setMedia(books);
          } else {
            setError('No books found for the selected mood. Please try a different mood.');
          }
        } else {
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
    
          if (mediaType === 'Anime') {
            url += '&with_keywords=210024'; // Keyword ID for anime
          }
    
          let data = await fetchFromApi(url);
    
          // If no results, try with only genres
          if (data.results.length === 0 && genres.length > 0) {
            url = `https://api.themoviedb.org/3/discover/${mediaType === 'Movie' ? 'movie' : 'tv'}?api_key=${API_KEY}&with_genres=${genres.join(',')}`;
            data = await fetchFromApi(url);
          }
    
          // If still no results, try with only keywords
          if (data.results.length === 0 && keywords.length > 0) {
            url = `https://api.themoviedb.org/3/discover/${mediaType === 'Movie' ? 'movie' : 'tv'}?api_key=${API_KEY}&with_keywords=${keywords.join('|')}`;
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

  const fetchBooksByMood = async (mood: string) => {
    const keywords = moodToBookKeywords[mood] || [];
    const query = encodeURIComponent(keywords.join(' '));
    const url = `${GOOGLE_BOOKS_API_BASE_URL}?q=${query}&maxResults=40`;
    
    try {
      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);

      if (data.items && data.items.length > 0) {
        return data.items.map((book: any) => ({
          id: book.id,
          title: book.volumeInfo.title,
          authors: book.volumeInfo.authors,
          publishedDate: book.volumeInfo.publishedDate,
          description: book.volumeInfo.description,
          categories: book.volumeInfo.categories,
          averageRating: book.volumeInfo.averageRating,
          imageLinks: book.volumeInfo.imageLinks,
          infoLink: book.volumeInfo.infoLink
        }));
      } else {
        console.log('No books found in the API response');
        return [];
      }
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };

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
          <MediaCard media={media[currentIndex]} mediaType={mediaType} />
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

export default MediaSuggestion;