import { useCallback, useEffect, useState } from 'react'

const VIEWPORT_MARGIN = 8

export function usePortalAnchor(
	anchorRef: React.RefObject<HTMLElement | null>,
	isOpen: boolean,
	offset: number
) {
	const [style, setStyle] = useState<React.CSSProperties>({})

	const updatePosition = useCallback(() => {
		const anchor = anchorRef.current
		if (!anchor) return

		const rect = anchor.getBoundingClientRect()
		const width = Math.min(rect.width, window.innerWidth - VIEWPORT_MARGIN * 2)
		const maxLeft = window.innerWidth - width - VIEWPORT_MARGIN
		const left = Math.max(VIEWPORT_MARGIN, Math.min(rect.left, maxLeft))

		setStyle({
			position: 'fixed',
			top: `${rect.bottom + offset}px`,
			left: `${left}px`,
			width: `${width}px`,
		})
	}, [anchorRef, offset])

	useEffect(() => {
		if (!isOpen) return

		updatePosition()
		window.addEventListener('resize', updatePosition)
		window.addEventListener('scroll', updatePosition, true)
		return () => {
			window.removeEventListener('resize', updatePosition)
			window.removeEventListener('scroll', updatePosition, true)
		}
	}, [isOpen, updatePosition])

	return { style, updatePosition }
}
