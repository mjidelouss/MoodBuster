
interface Genre {
  id: number;
  name: string;
}

const genres: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

interface GenreSelectorProps {
  onGenreSelect: (genre: Genre) => void;
}

function GenreSelector({ onGenreSelect }: GenreSelectorProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">Select a genre:</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {genres.map(genre => (
          <button
            key={genre.id}
            onClick={() => onGenreSelect(genre)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800 text-sm"
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default GenreSelector;