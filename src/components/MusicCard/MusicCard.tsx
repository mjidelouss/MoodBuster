import { motion } from 'framer-motion';

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  preview_url: string;
}

interface MusicCardProps {
  track: Track;
}

function MusicCard({ track }: MusicCardProps) {
  return (
    <motion.div 
      className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow-md flex flex-col md:flex-row"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex-1 md:mr-6 mb-4 md:mb-0">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 font-cinzel">
          {track.name}
        </h3>
        <div className="mb-2 flex items-center">
          <span className="inline-block bg-green-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
            Artist
          </span>
          <span className="text-gray-700 dark:text-gray-300 font-cinzel">
            {track.artists.map(artist => artist.name).join(', ')}
          </span>
        </div>
        <div className="mb-2 flex items-center">
          <span className="inline-block bg-blue-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
            Album
          </span>
          <span className="text-gray-700 dark:text-gray-300 font-acme">
            {track.album.name}
          </span>
        </div>
        {track.preview_url && (
          <audio controls src={track.preview_url} className="mt-4 w-full">
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
      <motion.img
        src={track.album.images[0].url}
        alt={track.album.name}
        className="w-48 h-auto rounded-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
    </motion.div>
  );
}

export default MusicCard;