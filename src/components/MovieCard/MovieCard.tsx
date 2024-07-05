import { motion } from 'framer-motion';

interface Movie {
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
}

interface MovieCardProps {
  movie: Movie;
}

function MovieCard({ movie }: MovieCardProps) {
  return (
    <motion.div 
      className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow-md flex flex-col md:flex-row"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex-1 md:mr-6 mb-4 md:mb-0">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 font-cinzel">
          {movie.title}
        </h3>
        <div className="mb-2 flex items-center">
          <span className="inline-block bg-green-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-rampart">
            Release Date
          </span>
          <span className="text-gray-700 dark:text-gray-300 font-cinzel">
            {movie.release_date}
          </span>
        </div>
        <div className="mb-4 flex items-center">
          <span className="inline-block bg-blue-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-rampart">
            Rating
          </span>
          <span className="text-gray-700 dark:text-gray-300 font-cinzel">
            {movie.vote_average.toFixed(1)}/10
          </span>
        </div>
        <p className="text-gray-700 dark:text-gray-300 font-acme">
          {movie.overview}
        </p>
      </div>
      <motion.img
        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        alt={movie.title}
        className="w-48 h-auto rounded-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
    </motion.div>
  );
}

export default MovieCard;