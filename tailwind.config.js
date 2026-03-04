module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          50: '#EBF3FF',
          100: '#DBEBFF',
          500: '#2563EB'
        },
        surface: {
          DEFAULT: '#F8FAFF'
        }
      }
    }
  },
  plugins: []
};