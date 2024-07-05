import { useState } from 'react';
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
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Mood Buster</h1>
            <ThemeToggle />
          </div>
          <MoodSelector onMoodSelect={setSelectedMood} />
          {selectedMood && <GenreSelector onGenreSelect={setSelectedGenre} />}
          {selectedMood && selectedGenre && (
            <MovieSuggestion mood={selectedMood} genre={selectedGenre} />
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;