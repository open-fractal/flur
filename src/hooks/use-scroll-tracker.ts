import { useEffect, useState } from 'react'

interface ScrollInfo {
	element: HTMLElement | null
	scrollTop: number
	scrollHeight: number
	clientHeight: number
	isScrolling: boolean
	scrollDirection: 'up' | 'down' | null
}

/**
 * Hook to track scroll events and provide information about the scrolling element
 * @param options Configuration options for the scroll tracker
 * @returns Object containing scroll information and the currently scrolling element
 */
export function useScrollTracker(options?: {
	throttleMs?: number // Throttle scroll event handling
	onScroll?: (info: ScrollInfo) => void // Callback when scroll occurs
}) {
	const [scrollInfo, setScrollInfo] = useState<ScrollInfo>({
		element: null,
		scrollTop: 0,
		scrollHeight: 0,
		clientHeight: 0,
		isScrolling: false,
		scrollDirection: null
	})

	useEffect(() => {
		let timeoutId: NodeJS.Timeout
		let lastScrollTop = 0
		let isThrottled = false

		// Handler for scroll events
		const handleScroll = (event: Event) => {
			if (isThrottled) return

			const target = event.target as HTMLElement
			const scrollableElement = findScrollableParent(target)

			if (!scrollableElement) return

			// Get scroll position and direction
			const scrollTop = scrollableElement.scrollTop
			const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up'
			lastScrollTop = scrollTop

			const newScrollInfo: ScrollInfo = {
				element: scrollableElement,
				scrollTop,
				scrollHeight: scrollableElement.scrollHeight,
				clientHeight: scrollableElement.clientHeight,
				isScrolling: true,
				scrollDirection
			}

			setScrollInfo(newScrollInfo)
			options?.onScroll?.(newScrollInfo)

			// Throttle subsequent updates
			if (options?.throttleMs) {
				isThrottled = true
				setTimeout(() => {
					isThrottled = false
				}, options.throttleMs)
			}

			// Reset isScrolling after scrolling stops
			clearTimeout(timeoutId)
			timeoutId = setTimeout(() => {
				setScrollInfo(prev => ({ ...prev, isScrolling: false }))
			}, 150)
		}

		// Find the first scrollable parent element
		const findScrollableParent = (element: HTMLElement | null): HTMLElement | null => {
			if (!element) return null

			const { overflow, overflowY } = window.getComputedStyle(element)
			const isScrollable = /(auto|scroll)/.test(overflow + overflowY)

			if (isScrollable && element.scrollHeight > element.clientHeight) {
				return element
			}

			return findScrollableParent(element.parentElement)
		}

		// Add scroll listeners to capture events from any element
		document.addEventListener('scroll', handleScroll, true)

		return () => {
			document.removeEventListener('scroll', handleScroll, true)
			clearTimeout(timeoutId)
		}
	}, [options])

	return scrollInfo
}
