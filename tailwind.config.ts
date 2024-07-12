import type { Config } from 'tailwindcss'

// Customise theme by adding aditional Colors here or other themes properties

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './ui/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backgroundColor: {
        'beige-sand': '#d2b48c',
      },
      textColor:{
        'primary':'#047857',
      },
      borderColor:{
        'primary':'#047857',
      },
      
    },
  },
  plugins: [],
}
export default config
