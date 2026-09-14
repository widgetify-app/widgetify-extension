import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { HexColorPicker, RgbaStringColorPicker } from 'react-colorful'
import { Portal } from '../portal/portal'

export interface ColorPickerProps {
	color: string
	onChange: (color: string) => void
	className?: string
	mode?: 'hex' | 'rgba'
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
	color,
	onChange,
	className = '',
	mode = 'hex',
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const triggerRef = useRef<HTMLDivElement>(null)
	const popupRef = useRef<HTMLDivElement>(null)
	const [coords, setCoords] = useState<{ top: number; left: number }>({
		top: 0,
		left: 0,
	})

	const displayColor = color || '#000000'

	const updatePosition = () => {
		if (!triggerRef.current) return
		const rect = triggerRef.current.getBoundingClientRect()
		const popupWidth = 220
		const popupHeight = 220

		let left = rect.left
		if (left + popupWidth > window.innerWidth - 16) {
			left = window.innerWidth - popupWidth - 16
		}
		if (left < 16) {
			left = 16
		}

		let top = rect.bottom + 8
		if (top + popupHeight > window.innerHeight - 16) {
			top = rect.top - popupHeight - 8
		}

		setCoords({ top, left })
	}

	useEffect(() => {
		if (!isOpen) return

		updatePosition()

		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node
			if (
				triggerRef.current &&
				!triggerRef.current.contains(target) &&
				popupRef.current &&
				!popupRef.current.contains(target)
			) {
				setIsOpen(false)
			}
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsOpen(false)
			}
		}

		const handleScroll = () => {
			updatePosition()
		}

		const timer = setTimeout(() => {
			document.addEventListener('mousedown', handleClickOutside)
			document.addEventListener('keydown', handleKeyDown)
			window.addEventListener('scroll', handleScroll, true)
			window.addEventListener('resize', handleScroll)
		}, 0)

		return () => {
			clearTimeout(timer)
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('keydown', handleKeyDown)
			window.removeEventListener('scroll', handleScroll, true)
			window.removeEventListener('resize', handleScroll)
		}
	}, [isOpen])

	return (
		<div className={`relative inline-flex items-center ${className}`}>
			<div
				ref={triggerRef}
				onClick={() => setIsOpen((prev) => !prev)}
				className="w-8 h-8 p-1 transition-transform border-0 shadow-xs cursor-pointer rounded-xl hover:scale-105 active:scale-95"
				style={{ backgroundColor: displayColor }}
			/>

			{isOpen && (
				<Portal topLayer>
					<div
						ref={popupRef}
						dir="ltr"
						className="fixed p-2.5 shadow-2xl rounded-2xl bg-base-200 border border-base-content/15 backdrop-blur-xl z-[99999] pointer-events-auto"
						style={{
							top: `${coords.top}px`,
							left: `${coords.left}px`,
							width: '220px',
						}}
					>
						{mode === 'hex' ? (
							<HexColorPicker color={displayColor} onChange={onChange} />
						) : (
							<RgbaStringColorPicker
								color={displayColor}
								onChange={onChange}
							/>
						)}
					</div>
				</Portal>
			)}
		</div>
	)
}
