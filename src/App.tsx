import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MediaTypeSelector from './components/MediaTypeSelector/MediaTypeSelector';
import MoodSelector from './components/MoodSelector/MoodSelector';
import GenreSelector from './components/GenreSelector/GenreSelector';
import MovieSuggestion from './components/MovieSuggestion/MovieSuggestion';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';

interface Genre {
  id: number;
  name: string;
}

function App() {
  const [selectedMediaType, setSelectedMediaType] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <ThemeProvider>
      <motion.div 
        className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <motion.h1
              className="text-5xl font-bold text-gray-800 dark:text-white font-honk"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 10 }}
            >
              Mood Buster
            </motion.h1>
            <ThemeToggle />
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMediaType ? (selectedMood ? (selectedGenre ? 'suggestion' : 'genre') : 'mood') : 'mediaType'}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              {!selectedMediaType ? (
                <MediaTypeSelector onMediaTypeSelect={setSelectedMediaType} />
              ) : !selectedMood ? (
                <MoodSelector onMoodSelect={setSelectedMood} />
              ) : !selectedGenre ? (
                <GenreSelector onGenreSelect={setSelectedGenre} />
              ) : (
                <MovieSuggestion mediaType={selectedMediaType} mood={selectedMood} genre={selectedGenre} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </ThemeProvider>
  );
}

export default App;