/** @type {import('next').NextConfig} */

const path = require('path')
const withNextra = require('nextra')({
	theme: 'nextra-theme-docs',
	themeConfig: './theme.config.jsx'
})

const nextConfig = {
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback = {
				fs: false,
				os: false,
				path: false,
				module: false
			}
		}

		config.resolve.alias = {
			...config.resolve.alias,
			'@scrypt-inc/bsv': path.resolve(__dirname, 'polyfills/bsv/import.js')
		}
		return config
	}
}

module.exports = withNextra(nextConfig)
