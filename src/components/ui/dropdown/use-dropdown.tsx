import { useCallback, useEffect, useRef, useState } from 'react'
import { listenEvent } from '@/common/utils/call-event'

export const useDropdown = () => {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const dropdownContentRef = useRef<HTMLDivElement>(null)

	const toggle = useCallback(() => setIsOpen((prev) => !prev), [])
	const close = useCallback(() => setIsOpen(false), [])
	const open = useCallback(() => setIsOpen(true), [])

	useEffect(() => {
		if (!isOpen) return

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

		const timeoutId = setTimeout(() => {
			document.addEventListener('mousedown', handleClickOutside)
			document.addEventListener('keydown', handleEscape)
		}, 0)

		return () => {
			clearTimeout(timeoutId)
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('keydown', handleEscape)
		}
	}, [isOpen, close])

	useEffect(() => {
		const ev = listenEvent('closeAllDropdowns', () => {
			close()
		})

		return () => {
			ev()
		}
	}, [close])

	return {
		isOpen,
		toggle,
		close,
		open,
		dropdownRef,
		dropdownContentRef,
	}
}
