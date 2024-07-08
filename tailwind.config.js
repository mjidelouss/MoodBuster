module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // This enables dark mode
  theme: {
    extend: {
      colors: {
        'white': '#ffffff',
        'purple': '#3f3cbb',
        'midnight': '#121063',
        'metal': '#565584',
        'tahiti': '#3ab7bf',
        'silver': '#ecebff',
        'bubble-gum': '#ff77e9',
        'bermuda': '#78dcca',
      },
      fontFamily: {
        acme: ['Acme', 'sans-serif'],
        cinzel: ['Cinzel', 'sans-serif'],
        audiowide: ['Audiowide', 'sans-serif'],
        honk: ['Honk', 'sans-serif'],
        rampart: ['Rampart', 'sans-serif'],
        eater: ['Eater', 'sans-serif'],
      },
    },
  },
  plugins: [],
}