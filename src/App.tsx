import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MediaTypeSelector from './components/MediaTypeSelector/MediaTypeSelector';
import MoodSelector from './components/MoodSelector/MoodSelector';
import MovieSuggestion from './components/MediaSuggestion/MediaSuggestion';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [selectedMediaType, setSelectedMediaType] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [step, setStep] = useState('mediaSelection');

  const handleMediaTypeSelect = (mediaType: string) => {
    setSelectedMediaType(mediaType);
    setStep('moodSelection');
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setStep('suggestion');
  };

  const handleReturnToMediaSelection = () => {
    setSelectedMediaType(null);
    setSelectedMood(null);
    setStep('mediaSelection');
  };

  const handleReturnToMoodSelection = () => {
    setSelectedMood(null);
    setStep('moodSelection');
  };

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

          <div className='flex justify-center mb-6 mt-6'>
            <motion.h2
              className="text-3xl font-bold text-gray-800 dark:text-white font-ang"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 10 }}
            >
              Discover top-rated Entertainment based<br/> <span className='flex justify-center'>on your mood</span>
            </motion.h2>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              {step === 'mediaSelection' && (
                <MediaTypeSelector onMediaTypeSelect={handleMediaTypeSelect} />
              )}
              {step === 'moodSelection' && (
                <MoodSelector onMoodSelect={handleMoodSelect} />
              )}
              {step === 'suggestion' && selectedMediaType && selectedMood && (
                <MovieSuggestion 
                  mediaType={selectedMediaType} 
                  mood={selectedMood} 
                  onReturnToMediaSelection={handleReturnToMediaSelection}
                  onReturnToMoodSelection={handleReturnToMoodSelection}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </ThemeProvider>
  );
}

export default App;