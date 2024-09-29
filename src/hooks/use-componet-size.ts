import 'resize-observer-polyfill/dist/ResizeObserver.global'
import { useState, useRef, useCallback, useLayoutEffect } from 'react'

function useComponentSize(defaultWidth = 0) {
	const [size, setSize] = useState({
		height: 0,
		width: defaultWidth
	})
	const ref = useRef(null)

	const onResize = useCallback(() => {
		if (!ref.current) {
			return
		}

		const newHeight = ref.current.offsetHeight
		const newWidth = ref.current.offsetWidth

		if (newHeight !== size.height || newWidth !== size.width) {
			setSize({
				height: newHeight,
				width: newWidth
			})
		}
	}, [size.height, size.width, ref.current])

	useLayoutEffect(() => {
		if (!ref || !ref.current) {
			return
		}

		const resizeObserver = new ResizeObserver(onResize)
		resizeObserver.observe(ref.current)

		return () => resizeObserver.disconnect()
	}, [ref, onResize])

	return {
		ref,
		...size
	}
}

export default useComponentSize
