import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-600"
    >
      {isDarkMode ? '🌞' : '🌙'}
    </button>
  );
};

export default ThemeToggle;