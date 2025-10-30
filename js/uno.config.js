// uno.config.js
import { defineConfig, presetUno, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons()
  ],
  shortcuts: {
    // Botones
    'btn-accent': 'bg-cyan-500 text-white px-4 py-2 rounded-md transition-all hover:bg-cyan-600',
    'btn-lg': 'px-6 py-3 text-lg rounded-lg font-semibold transition-transform hover:-translate-y-1',

    // Títulos de sección
    'section-title': 'mb-12 text-center',
    'section-title-h2': 'text-3xl font-bold text-gray-100 relative inline-block pb-2 after:content-empty after:block after:h-0.5 after:w-16 after:bg-cyan-500 after:mx-auto after:mt-2',

    // Cards de producto
    'product-card': 'bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col transition-all hover:-translate-y-1 hover:shadow-xl',
    'product-image': 'h-64 flex items-center justify-center bg-gray-900',
    'product-body': 'p-4 flex flex-col flex-grow justify-between',
    'product-title': 'font-semibold text-lg mb-2 text-gray-100',
    'product-description': 'text-sm text-gray-400 flex-grow mb-3',
    'product-price': 'text-xl font-bold text-cyan-500',

    // Cards de beneficios
    'benefit-card': 'bg-gray-900 p-6 rounded-lg shadow-md text-center transition-all hover:-translate-y-1 hover:shadow-xl',
    'benefit-icon': 'text-cyan-500 mb-3 text-3xl',
    'benefit-title': 'text-lg font-semibold mb-2 text-gray-100',
    'benefit-text': 'text-gray-400',

    // Footer
    'footer': 'bg-gray-950 py-10 mt-10 text-gray-400 text-sm',
    'footer-title': 'font-bold text-lg mb-3 text-white',
    'footer-link': 'hover:text-cyan-500 transition-colors',
  },
  rules: [
    ['text-accent', { color: '#00bcd4' }],
  ]
})
