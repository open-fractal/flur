import './global.css'

export default function App({ Component, pageProps }) {
	return (
		// Apply Tailwind classes to the body
		<div className="bg-black text-white">
			<Component {...pageProps} />
		</div>
	)
}
