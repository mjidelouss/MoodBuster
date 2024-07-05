

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
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">Select your mood:</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {moods.map(mood => (
          <button
            key={mood}
            onClick={() => onMoodSelect(mood)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors dark:bg-green-700 dark:hover:bg-green-800 text-sm"
          >
            {mood}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MoodSelector;