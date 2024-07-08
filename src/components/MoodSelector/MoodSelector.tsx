import { motion } from 'framer-motion';

const moods = [
  'Cozy and Comforting',
  'Adventure Craving',
  'Heartwarming and Uplifting',
  'Intellectually Stimulating',
  'Nostalgic and Sentimental',
  'Laugh Out Loud',
  'Edge of Your Seat',
  'Mysteriously Intrigued',
  'Feel-Good Escape',
  'Romantic and Dreamy',
  'Epic and Grandiose',
  'Deep and Reflective',
  'Playful and Fun',
  'Thrill Seeker',
  'Inspirational and Motivating',
  'Relaxed and Chill',
  'Imaginative and Fantastical',
  'Somber and Thought-Provoking',
  'Lighthearted and Breezy',
  'Mind-Bending and Twisty'
] as const;

type Mood = typeof moods[number];

interface MoodSelectorProps {
  onMoodSelect: (mood: Mood) => void;
}

function MoodSelector({ onMoodSelect }: MoodSelectorProps) {
  return (
    <motion.div 
      className="mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3 font-audiowide">Select your mood:</h2>
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="show"
      >
        {moods.map(mood => (
          <motion.button
            key={mood}
            onClick={() => onMoodSelect(mood)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors dark:bg-green-700 dark:hover:bg-green-800 text-sm font-audiowide"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {mood}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default MoodSelector;