// MediaCard.tsx

import { motion } from "framer-motion";

interface Media {
  id: string | number;
  title?: string;
  name?: string;
  poster_path?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  overview?: string;
  genres?: { id: number; name: string }[] | string[];
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
  image?: string;
  prep_time_minutes?: number;
  cook_time_minutes?: number;
  total_time_minutes?: number;
  num_servings?: number;
  tags?: string[];
  ingredients?: string;
  instructions?: string;
  artists?: string;
  album?: string;
  releaseDate?: string;
  preview_url?: string;
  duration_ms?: number;
  popularity?: number;
  explicit?: boolean;
  track_number?: number;
  disc_number?: number;
  external_urls?: { spotify: string };
  owner?: string;
  coverArt?: {
    sources: {
      url: string;
      width: number;
      height: number;
    }[];
  };
  publisher?: {name: string;} | string;
  type?: string;
  mediaType?: string;
  platforms?: string[];
  rating?: number;
  developer?: string;
  gameMode?: string;
  coverUrl?: string;
}

interface MediaCardProps {
  media: Media;
  mediaType: string;
}

function MediaCard({ media, mediaType }: MediaCardProps) {
  const title = media.title || media.name;
  const description = media.overview || media.description;

  const director = media.credits?.crew.find(
    (person) => person.job === "Director"
  )?.name;
  const cast = media.credits?.cast
    .slice(0, 5)
    .map((actor) => actor.name)
    .join(", ");

  const getImageUrl = () => {
    if (mediaType === "Game") {
      return media.coverUrl || null;
    } else if (mediaType === "Book") {
      return media.imageLinks?.thumbnail || media.imageLinks?.smallThumbnail;
    } else if (mediaType === "Food" || mediaType === "Drink") {
      return media.image;
    } else if (
      mediaType === "Music" ||
      mediaType === "Playlist" ||
      mediaType === "Podcast"
    ) {
      if (media.coverArt && media.coverArt.sources) {
        // Sort sources by size (descending) and get the largest
        const sortedSources = [...media.coverArt.sources].sort(
          (a, b) => b.width * b.height - a.width * a.height
        );
        return sortedSources[0].url;
      }
      return media.image || null;
    } else {
      return media.poster_path
        ? `https://image.tmdb.org/t/p/w300${media.poster_path}`
        : null;
    }
  };

  const imageUrl = getImageUrl();

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds) < 10 ? "0" : ""}${seconds}`;
  };

  const limitedTags = media.tags?.slice(0, 3) || [];

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
        {mediaType === "Game" && (
          <>
            {media.platforms && (
              <div className="mb-2 flex items-center">
                <span className="inline-block bg-purple-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
                  Platforms
                </span>
                <span className="text-gray-700 dark:text-gray-300 font-acme">
                  {media.platforms.join(", ")}
                </span>
              </div>
            )}
            {media.developer && (
              <div className="mb-2 flex items-center">
                <span className="inline-block bg-indigo-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
                  Developer
                </span>
                <span className="text-gray-700 dark:text-gray-300 font-acme">
                  {media.developer}
                </span>
              </div>
            )}
            {media.publisher && (
              <div className="mb-2 flex items-center">
                <span className="inline-block bg-blue-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
                  Publisher
                </span>
                <span className="text-gray-700 dark:text-gray-300 font-acme">
                {typeof media.publisher === 'string' ? media.publisher : media.publisher.name}
                </span>
              </div>
            )}
            {media.gameMode && (
              <div className="mb-2 flex items-center">
                <span className="inline-block bg-green-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
                  Game Mode
                </span>
                <span className="text-gray-700 dark:text-gray-300 font-acme">
                  {media.gameMode}
                </span>
              </div>
            )}
          </>
        )}
        {mediaType === "Podcast" && (
          <>
            {media.publisher && (
              <div className="mb-2 flex items-center">
                <span className="inline-block bg-red-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
                  Publisher
                </span>
                <span className="text-gray-700 dark:text-gray-300 font-acme">
                {typeof media.publisher === 'string' ? media.publisher : media.publisher.name}
                </span>
              </div>
            )}
            {media.type && (
              <div className="mb-2 flex items-center">
                <span className="inline-block bg-blue-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
                  Type
                </span>
                <span className="text-gray-700 dark:text-gray-300 font-acme">
                  {media.type}
                </span>
              </div>
            )}
            {media.mediaType && (
              <div className="mb-2 flex items-center">
                <span className="inline-block bg-green-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
                  Media Type
                </span>
                <span className="text-gray-700 dark:text-gray-300 font-acme">
                  {media.mediaType}
                </span>
              </div>
            )}
          </>
        )}
        {mediaType === "Playlist" && (
          <>
            {media.owner && (
              <div className="mb-2 flex items-center">
                <span className="inline-block bg-red-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
                  Owner
                </span>
                <span className="text-gray-700 dark:text-gray-300 font-acme">
                  {media.owner}
                </span>
              </div>
            )}
          </>
        )}
        {mediaType === "Music" && (
          <>
            <div className="mb-2 flex items-center">
              <span className="inline-block bg-red-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
                Artist(s)
              </span>
              <span className="text-gray-700 dark:text-gray-300 font-acme">
                {media.artists}
              </span>
            </div>
            <div className="mb-2 flex items-center">
              <span className="inline-block bg-indigo-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
                Album
              </span>
              <span className="text-gray-700 dark:text-gray-300 font-acme">
                {media.album}
              </span>
            </div>
            {media.releaseDate && (
              <div className="mb-2 flex items-center">
                <span className="inline-block bg-green-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
                  Release Year
                </span>
                <span className="text-gray-700 dark:text-gray-300 font-acme">
                  {media.releaseDate}
                </span>
              </div>
            )}
            {media.duration_ms && (
              <div className="mb-2 flex items-center">
                <span className="inline-block bg-yellow-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
                  Duration
                </span>
                <span className="text-gray-700 dark:text-gray-300 font-acme">
                  {formatDuration(media.duration_ms)}
                </span>
              </div>
            )}
            {media.popularity !== undefined && (
              <div className="mb-2 flex items-center">
                <span className="inline-block bg-red-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
                  Popularity
                </span>
                <span className="text-gray-700 dark:text-gray-300 font-acme">
                  {media.popularity}/100
                </span>
              </div>
            )}
            {media.explicit !== undefined && (
              <div className="mb-2 flex items-center">
                <span className="inline-block bg-pink-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
                  Explicit
                </span>
                <span className="text-gray-700 dark:text-gray-300 font-acme">
                  {media.explicit ? "Yes" : "No"}
                </span>
              </div>
            )}
            {media.track_number && (
              <div className="mb-2 flex items-center">
                <span className="inline-block bg-blue-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
                  Track Number
                </span>
                <span className="text-gray-700 dark:text-gray-300 font-acme">
                  {media.track_number}
                </span>
              </div>
            )}
            {media.disc_number && (
              <div className="mb-2 flex items-center">
                <span className="inline-block bg-teal-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
                  Disc Number
                </span>
                <span className="text-gray-700 dark:text-gray-300 font-acme">
                  {media.disc_number}
                </span>
              </div>
            )}
            {media.genres && media.genres.length > 0 && (
              <div className="mb-2 flex items-center">
                <span className="inline-block bg-gray-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
                  Genres
                </span>
                <span className="text-gray-700 dark:text-gray-300 font-acme">
                  {media.genres.join(", ")}
                </span>
              </div>
            )}
            {media.preview_url && (
              <audio controls className="mt-4 w-full">
                <source src={media.preview_url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
            {media.external_urls?.spotify && (
              <a
                href={media.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors font-audiowide"
              >
                Open in Spotify
              </a>
            )}
          </>
        )}
        {(mediaType === "Food" || mediaType === "Drink") && (
          <>
            {media.total_time_minutes && (
              <div className="mb-2 flex items-center">
                <span className="inline-block bg-yellow-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
                  Total Time
                </span>
                <span className="text-gray-700 dark:text-gray-300 font-acme">
                  {media.total_time_minutes} minutes
                </span>
              </div>
            )}
            {media.num_servings && (
              <div className="mb-2 flex items-center">
                <span className="inline-block bg-green-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
                  Servings
                </span>
                <span className="text-gray-700 dark:text-gray-300 font-acme">
                  {media.num_servings}
                </span>
              </div>
            )}
            {limitedTags.length > 0 && (
              <div className="mb-2 flex items-center">
                <span className="inline-block bg-blue-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
                  Tags
                </span>
                <span className="text-gray-700 dark:text-gray-300 font-acme">
                  {limitedTags.join(", ")}
                </span>
              </div>
            )}
            {media.ingredients && (
              <div className="mb-2">
                <span className="inline-block bg-red-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
                  Ingredients
                </span>
                <p className="text-gray-700 dark:text-gray-300 font-acme mt-1">
                  {media.ingredients}
                </p>
              </div>
            )}
            {media.instructions && (
              <div className="mb-2">
                <span className="inline-block bg-pink-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
                  Instructions
                </span>
                <p className="text-gray-700 dark:text-gray-300 font-acme mt-1">
                  {media.instructions}
                </p>
              </div>
            )}
          </>
        )}
        {mediaType !== "Food" &&
          mediaType !== "Drink" &&
          media.release_date && (
            <div className="mb-2 flex items-center">
              <span className="inline-block bg-green-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
                {mediaType === "Book"
                  ? "Published Date"
                  : mediaType === "TV Show"
                  ? "First Air Date"
                  : "Release Date"}
              </span>
              <span className="text-gray-700 dark:text-gray-300 font-cinzel">
                {media.release_date}
              </span>
            </div>
          )}
        {mediaType === "Book" && media.authors && (
          <div className="mb-2 flex items-center">
            <span className="inline-block bg-red-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
              Author(s)
            </span>
            <span className="text-gray-700 dark:text-gray-300 font-acme">
              {media.authors.join(", ")}
            </span>
          </div>
        )}
        {mediaType === "Book" && media.categories && (
          <div className="mb-2 flex items-center">
            <span className="inline-block bg-yellow-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
              Categories
            </span>
            <span className="text-gray-700 dark:text-gray-300 font-acme">
              {media.categories.join(", ")}
            </span>
          </div>
        )}
        {(media.averageRating || media.vote_average) && (
          <div className="mb-2 flex items-center">
            <span className="inline-block bg-blue-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
              Rating
            </span>
            <span className="text-gray-700 dark:text-gray-300 font-acme">
              {media.averageRating
                ? `${media.averageRating.toFixed(1)}/5`
                : `${media.vote_average?.toFixed(1)}/10`}
            </span>
          </div>
        )}
        {media.genres && media.genres.length > 0 && (
          <div className="mb-2 flex items-center">
            <span className="inline-block bg-yellow-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
              Genres
            </span>
            <span className="text-gray-700 dark:text-gray-300 font-acme">
              {media.genres
                .map((genre) =>
                  typeof genre === "string" ? genre : genre.name
                )
                .join(", ")}
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
        {mediaType === "TV Show" && media.number_of_seasons && (
          <div className="mb-2 flex items-center">
            <span className="inline-block bg-yellow-500 text-white text-sm px-2 py-1 rounded-full mr-2 font-audiowide">
              Seasons
            </span>
            <span className="text-gray-700 dark:text-gray-300 font-acme">
              {media.number_of_seasons}
            </span>
          </div>
        )}
        {mediaType === "TV Show" && media.number_of_episodes && (
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
        {(mediaType === "Playlist" || mediaType === "Podcast") &&
          media.external_urls?.spotify && (
            <a
              href={media.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors font-audiowide"
            >
              Open in Spotify
            </a>
          )}
        {mediaType === "Book" && media.infoLink && (
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
          className="flex-shrink-0 w-48 h-48"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <img
            src={imageUrl}
            alt={title}
            className="rounded-lg w-full h-full object-cover"
          />
        </motion.div>
      )}
    </motion.div>
  );
}

export default MediaCard;
