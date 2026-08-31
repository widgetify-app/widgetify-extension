import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { RgbaStringColorPicker } from 'react-colorful'

export interface ColorPickerProps {
	color: string
	onChange: (color: string) => void
	className?: string
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
	color,
	onChange,
	className = '',
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)

	const displayColor = color || '#000000'

	useEffect(() => {
		if (!isOpen) return

		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node
			if (containerRef.current && !containerRef.current.contains(target)) {
				setIsOpen(false)
			}
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsOpen(false)
			}
		}

		const timer = setTimeout(() => {
			document.addEventListener('mousedown', handleClickOutside)
			document.addEventListener('keydown', handleKeyDown)
		}, 0)

		return () => {
			clearTimeout(timer)
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [isOpen])

	return (
		<div
			ref={containerRef}
			className={`relative inline-flex items-center ${isOpen ? 'z-50' : ''} ${className}`}
		>
			<div
				onClick={() => setIsOpen((prev) => !prev)}
				className="w-8 h-8 p-1 transition-transform border-0 rounded-md shadow-xs cursor-pointer hover:scale-105 active:scale-95"
				style={{ backgroundColor: displayColor }}
			/>

			{isOpen && (
				<div
					className="absolute right-0 top-full mt-2 p-2.5 shadow-2xl rounded-2xl bg-base-200 border border-base-content/15 backdrop-blur-xl z-50"
					style={{ width: '200px' }}
				>
					<RgbaStringColorPicker color={displayColor} onChange={onChange} />
				</div>
			)}
		</div>
	)
}
