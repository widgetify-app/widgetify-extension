import { useCallback, useEffect, useRef, useState } from 'react'
import { RgbaStringColorPicker } from 'react-colorful'
import { createPortal } from 'react-dom'

interface PopoverColorPickerProps {
	color: string
	onChange: (color: string) => void
}

export const ColorPicker: React.FC<PopoverColorPickerProps> = ({ color, onChange }) => {
	const triggerRef = useRef<HTMLDivElement>(null)
	const popoverRef = useRef<HTMLDivElement>(null)
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const [position, setPosition] = useState({ top: 0, left: 0 })

	const updatePosition = useCallback(() => {
		if (!triggerRef.current) return
		const rect = triggerRef.current.getBoundingClientRect()
		const popoverWidth = 200
		const popoverHeight = 220

		let top = rect.bottom + 6
		if (top + popoverHeight > window.innerHeight && rect.top > popoverHeight) {
			top = rect.top - popoverHeight - 6
		}

		let left = rect.right - popoverWidth
		if (left < 10) left = rect.left
		if (left + popoverWidth > window.innerWidth - 10) {
			left = window.innerWidth - popoverWidth - 10
		}
		if (left < 10) left = 10

		setPosition({ top, left })
	}, [])

	useEffect(() => {
		if (isOpen) {
			updatePosition()
		}
	}, [isOpen, updatePosition])

	useEffect(() => {
		if (!isOpen) return

		const handleClickOutside = (event: MouseEvent) => {
			if (
				popoverRef.current &&
				!popoverRef.current.contains(event.target as Node) &&
				triggerRef.current &&
				!triggerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		const handleReposition = () => {
			updatePosition()
		}

		document.addEventListener('mousedown', handleClickOutside)
		window.addEventListener('scroll', handleReposition, true)
		window.addEventListener('resize', handleReposition)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			window.removeEventListener('scroll', handleReposition, true)
			window.removeEventListener('resize', handleReposition)
		}
	}, [isOpen, updatePosition])

	const displayColor = color || '#000000'

	return (
		<>
			<div
				ref={triggerRef}
				className="!w-8 !h-8 cursor-pointer !rounded-md border-0 !p-1 shadow-xs hover:scale-105 active:scale-95 transition-transform"
				style={{ backgroundColor: displayColor }}
				onClick={() => setIsOpen(!isOpen)}
			/>

			{isOpen &&
				createPortal(
					<div
						ref={popoverRef}
						className="fixed flex p-2 border shadow-2xl rounded-xl bg-base-200 border-base-content/15 backdrop-blur-xl"
						style={{
							top: `${position.top}px`,
							left: `${position.left}px`,
							width: '200px',
							zIndex: 99999,
						}}
					>
						<RgbaStringColorPicker color={displayColor} onChange={onChange} />
					</div>,
					document.body
				)}
		</>
	)
}
