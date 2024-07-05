
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
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow-md flex flex-col md:flex-row">
        <div className="flex-1 md:mr-6 mb-4 md:mb-0">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{movie.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-1">Release Date: {movie.release_date}</p>
          <p className="text-gray-600 dark:text-gray-400 mb-2">Rating: {movie.vote_average}/10</p>
          <p className="text-gray-700 dark:text-gray-300">{movie.overview}</p>
        </div>
        <img 
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} 
          alt={movie.title}
          className="w-48 h-auto rounded-lg" 
        />
      </div>
    );
  }

export default MovieCard;