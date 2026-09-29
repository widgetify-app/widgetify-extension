import { useState, type ReactNode } from 'react'
import { Presence, Motion as motion } from '@/common/motion'
import { Portal } from '../portal/portal'

const SHEET_HEIGHT = '50vh'
const CLOSE_DRAG_DISTANCE = 100

interface BottomSheetProps {
	isOpen: boolean
	onClose: () => void
	children: ReactNode
}

export function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
	const [isDragging, setIsDragging] = useState(false)

	const handleDragEnd = (_: any, info: any) => {
		setIsDragging(false)

		if (info.offset.y > CLOSE_DRAG_DISTANCE) {
			onClose()
		}
	}

	return (
		<Portal>
			<Presence>
				{isOpen && (
					<motion.div
						key="bottom-sheet-backdrop"
						className={`fixed inset-0 z-float ${isDragging ? '' : 'bg-scrim'}`}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.25, ease: 'easeOut' }}
						onClick={onClose}
					/>
				)}

				{isOpen && (
					<motion.div
						key="bottom-sheet-panel"
						className={`fixed left-0 right-0 ${isDragging ? 'z-10' : 'z-float'} bottom-16 min-w-2xl bg-glass-surface-2 rounded-t-widget`}
						style={{
							height: SHEET_HEIGHT,
							maxWidth: '390px',
							margin: '0 auto',
							touchAction: 'none',
							willChange: 'transform',
						}}
						initial={{ y: '100%' }}
						animate={{ y: 0 }}
						exit={{
							y: '100%',
							transition: { duration: 0.25, ease: 'easeIn' },
						}}
						transition={{
							type: 'spring',
							damping: 30,
							stiffness: 300,
							mass: 0.8,
						}}
						drag="y"
						dragConstraints={{ top: 0, bottom: 0 }}
						dragElastic={{ top: 0, bottom: 0.5 }}
						onDragStart={() => setIsDragging(true)}
						onDragEnd={handleDragEnd}
						dragMomentum={false}
					>
						<div className="flex justify-center pt-4 pb-1 cursor-grab active:cursor-grabbing">
							<motion.div
								className="rounded-full bg-fill-2"
								animate={{
									scaleX: isDragging ? 0.57 : 1,
									scaleY: isDragging ? 0.7 : 1,
								}}
								transition={{ duration: 0.2 }}
								style={{ height: '3px', width: '28px' }}
							/>
						</div>

						<div
							className="px-4 pt-2 pb-4 mt-1 overflow-y-auto scrollbar-none"
							style={{
								height: `calc(${SHEET_HEIGHT} - 30px)`,
								WebkitOverflowScrolling: 'touch',
							}}
						>
							{children}
						</div>
					</motion.div>
				)}
			</Presence>
		</Portal>
	)
}
