import { useEffect, useRef, useState } from 'react'
import { RgbaStringColorPicker } from 'react-colorful'
import { createPortal } from 'react-dom'

interface PopoverColorPickerProps {
	color: string
	onChange: (color: string) => void
}

const PopoverColorPicker: React.FC<PopoverColorPickerProps> = ({ color, onChange }) => {
	const triggerRef = useRef<HTMLDivElement>(null)
	const popoverRef = useRef<HTMLDivElement>(null)
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const [position, setPosition] = useState({ top: 0, left: 0 })

	useEffect(() => {
		if (isOpen && triggerRef.current) {
			const rect = triggerRef.current.getBoundingClientRect()
			setPosition({
				top: rect.bottom + window.scrollY,
				left: rect.right - 20 + window.scrollX,
			})
		}
	}, [isOpen])

	useEffect(() => {
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

		const handleScroll = () => {
			if (triggerRef.current && isOpen) {
				const rect = triggerRef.current.getBoundingClientRect()
				setPosition({
					top: rect.bottom + window.scrollY,
					left: rect.right - 200 + window.scrollX,
				})
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		window.addEventListener('scroll', handleScroll)
		window.addEventListener('resize', handleScroll)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			window.removeEventListener('scroll', handleScroll)
			window.removeEventListener('resize', handleScroll)
		}
	}, [isOpen])

	const getPopoverStyle = () => {
		return 'bg-content shadow-lg border border-content'
	}

	const displayColor = color || '#000000'

	return (
		<>
			<div
				ref={triggerRef}
				className="!w-8 !h-8 cursor-pointer !rounded-md border-0 !p-1"
				style={{ backgroundColor: displayColor }}
				onClick={() => setIsOpen(!isOpen)}
			/>

			{isOpen &&
				createPortal(
					<div
						ref={popoverRef}
						className={`fixed flex p-2 rounded-md ${getPopoverStyle()}`}
						style={{
							top: `${position.top}px`,
							left: `${position.left}px`,
							width: '200px',
							zIndex: 50,
						}}
					>
						<RgbaStringColorPicker color={displayColor} onChange={onChange} />
					</div>,
					document.body
				)}
		</>
	)
}

export default PopoverColorPicker
