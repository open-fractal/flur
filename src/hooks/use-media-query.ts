import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState(false)

	useEffect(() => {
		const media = window.matchMedia(query)
		setMatches(media.matches)

		const listener = () => setMatches(media.matches)
		media.addListener(listener)
		return () => media.removeListener(listener)
	}, [query])

	return matches
}
