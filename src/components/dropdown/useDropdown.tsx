import { useCallback, useEffect, useRef, useState } from 'react'
import { listenEvent } from '@/common/utils/call-event'

/**
 * Hook for managing dropdown state with click outside functionality
 */
export const useDropdown = () => {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const dropdownContentRef = useRef<HTMLDivElement>(null)

	const toggle = useCallback(() => setIsOpen((prev) => !prev), [])
	const close = useCallback(() => setIsOpen(false), [])
	const open = useCallback(() => setIsOpen(true), [])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node

			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(target) &&
				dropdownContentRef.current &&
				!dropdownContentRef.current.contains(target)
			) {
				close()
			}
		}

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				close()
			}
		}

		const handleScroll = (event: Event) => {
			if (
				event.target &&
				dropdownContentRef.current &&
				(dropdownContentRef.current.contains(event.target as Node) ||
					dropdownContentRef.current === event.target)
			) {
				return
			}

			close()
		}

		const handleResize = () => {
			if (isOpen) {
				close()
			}
		}

		if (isOpen) {
			const timeoutId = setTimeout(() => {
				document.addEventListener('mousedown', handleClickOutside)
				document.addEventListener('keydown', handleEscape)
				window.addEventListener('scroll', handleScroll, true)
				window.addEventListener('resize', handleResize)
			}, 100)

			return () => {
				clearTimeout(timeoutId)
				document.removeEventListener('mousedown', handleClickOutside)
				document.removeEventListener('keydown', handleEscape)
				window.removeEventListener('scroll', handleScroll, true)
				window.removeEventListener('resize', handleResize)
			}
		}
	}, [isOpen, close])

	useEffect(() => {
		const ev = listenEvent('closeAllDropdowns', () => {
			close()
		})

		return () => {
			ev()
		}
	}, [])

	return {
		isOpen,
		toggle,
		close,
		open,
		dropdownRef,
		dropdownContentRef,
	}
}
