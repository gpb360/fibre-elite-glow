module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // Preserve class names in development for better debugging
    ...(process.env.NODE_ENV === 'development' && {
      'postcss-preset-env': {
        features: {
          'custom-properties': false,
        },
      },
    }),
  },
}
