import { motion } from 'framer-motion';

const mediaTypes = ['Movie', 'TV Show', 'Anime'] as const;

type MediaType = typeof mediaTypes[number];

interface MediaTypeSelectorProps {
  onMediaTypeSelect: (mediaType: MediaType) => void;
}

function MediaTypeSelector({ onMediaTypeSelect }: MediaTypeSelectorProps) {
  return (
    <motion.div 
      className="mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3 font-audiowide">Select media type:</h2>
      <motion.div 
        className="flex justify-center space-x-4"
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
        {mediaTypes.map(mediaType => (
          <motion.button
            key={mediaType}
            onClick={() => onMediaTypeSelect(mediaType)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors dark:bg-red-700 dark:hover:bg-red-800 text-sm"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {mediaType}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default MediaTypeSelector;