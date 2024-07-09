// MediaCard.tsx

import { motion } from 'framer-motion';

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

interface MediaCardProps {
  media: Media;
  mediaType: string;
}

function MediaCard({ media, mediaType }: MediaCardProps) {
  const title = media.title || media.name;
  const releaseDate = media.release_date || media.first_air_date || media.publishedDate;
  const description = media.overview || media.description;

  const director = media.credits?.crew.find(person => person.job === 'Director')?.name;
  const cast = media.credits?.cast.slice(0, 5).map(actor => actor.name).join(', ');

  const getImageUrl = () => {
    if (mediaType === 'Book') {
      return media.imageLinks?.thumbnail || media.imageLinks?.smallThumbnail;
    } else {
      return media.poster_path ? `https://image.tmdb.org/t/p/w300${media.poster_path}` : null;
    }
  };

  const imageUrl = getImageUrl();

  return (
    <motion.div 
      className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow-md flex flex-col md:flex-row"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex-1 md:mr-6 mb-4 md:mb-0">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 font-cinzel">
          {title}
        </h3>
        <div className="mb-2 flex items-center">
          <span className="inline-block bg-green-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
            {mediaType === 'Book' ? 'Published Date' : mediaType === 'TV Show' ? 'First Air Date' : 'Release Date'}
          </span>
          <span className="text-gray-700 dark:text-gray-300 font-cinzel">
            {releaseDate}
          </span>
        </div>
        {mediaType === 'Book' && media.authors && (
          <div className="mb-2 flex items-center">
            <span className="inline-block bg-red-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
              Author(s)
            </span>
            <span className="text-gray-700 dark:text-gray-300 font-acme">
              {media.authors.join(', ')}
            </span>
          </div>
        )}
        {mediaType === 'Book' && media.categories && (
          <div className="mb-2 flex items-center">
            <span className="inline-block bg-yellow-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
              Categories
            </span>
            <span className="text-gray-700 dark:text-gray-300 font-acme">
              {media.categories.join(', ')}
            </span>
          </div>
        )}
        {(media.averageRating || media.vote_average) && (
          <div className="mb-2 flex items-center">
            <span className="inline-block bg-blue-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
              Rating
            </span>
            <span className="text-gray-700 dark:text-gray-300 font-acme">
              {media.averageRating ? `${media.averageRating.toFixed(1)}/5` : `${media.vote_average?.toFixed(1)}/10`}
            </span>
          </div>
        )}
        {media.genres && (
          <div className="mb-2 flex items-center">
            <span className="inline-block bg-yellow-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
              Genres
            </span>
            <span className="text-gray-700 dark:text-gray-300 font-acme">
              {media.genres.map(genre => genre.name).join(', ')}
            </span>
          </div>
        )}
        {(media.runtime || media.episode_run_time) && (
          <div className="mb-2 flex items-center">
            <span className="inline-block bg-red-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
              Runtime
            </span>
            <span className="text-gray-700 dark:text-gray-300 font-acme">
              {media.runtime || media.episode_run_time?.[0]} minutes
            </span>
          </div>
        )}
        {mediaType === 'TV Show' && media.number_of_seasons && (
          <div className="mb-2 flex items-center">
            <span className="inline-block bg-yellow-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
              Seasons
            </span>
            <span className="text-gray-700 dark:text-gray-300 font-acme">
              {media.number_of_seasons}
            </span>
          </div>
        )}
        {mediaType === 'TV Show' && media.number_of_episodes && (
          <div className="mb-2 flex items-center">
            <span className="inline-block bg-pink-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
              Episodes
            </span>
            <span className="text-gray-700 dark:text-gray-300 font-acme">
              {media.number_of_episodes}
            </span>
          </div>
        )}
        {director && (
          <div className="mb-2 flex items-center">
            <span className="inline-block bg-indigo-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
              Director
            </span>
            <span className="text-gray-700 dark:text-gray-300 font-acme">
              {director}
            </span>
          </div>
        )}
        {cast && (
          <div className="mb-4 flex items-center">
            <span className="inline-block bg-teal-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
              Cast
            </span>
            <span className="text-gray-700 dark:text-gray-300 font-acme">
              {cast}
            </span>
          </div>
        )}
        <p className="text-gray-700 dark:text-gray-300 font-acme">
          {description}
        </p>
        {mediaType === 'Book' && media.infoLink && (
          <a 
            href={media.infoLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors font-audiowide"
          >
            More Info
          </a>
        )}
      </div>
      {imageUrl && (
        <motion.div
          className={`flex-shrink-0 ${mediaType === 'Book' ? 'w-48 h-64' : 'w-48'}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <img
            src={imageUrl}
            alt={title}
            className={`rounded-lg ${mediaType === 'Book' ? 'w-full h-full object-cover' : 'w-full h-auto'}`}
          />
        </motion.div>
      )}
    </motion.div>
  );
}

export default MediaCard;