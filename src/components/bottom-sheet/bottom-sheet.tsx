import { useState, useRef, type ReactNode } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { MdClose } from 'react-icons/md'
import { Portal } from '../portal/Portal'
import { HiChevronRight } from 'react-icons/hi2'

type SheetSize = 'small' | 'medium' | 'large' | 'full' | 'screen'

interface BottomSheetProps {
	isOpen: boolean
	onClose: () => void
	size?: SheetSize
	title?: ReactNode
	showBack?: boolean
	onClickBack?: () => void
	children: ReactNode
	showCloseButton?: boolean
	closeOnBackdrop?: boolean
	dragThreshold?: number
}

export function BottomSheet({
	isOpen,
	onClose,
	size = 'medium',
	title,
	children,
	showCloseButton = true,
	closeOnBackdrop = true,
	dragThreshold = 100,
	onClickBack,
	showBack,
}: BottomSheetProps) {
	const [isDragging, setIsDragging] = useState(false)

	const sizes: Record<SheetSize, string> = {
		small: '30vh',
		medium: '50vh',
		large: '75vh',
		full: '90vh',
		screen: '98vh',
	}

	const handleDragEnd = (_: any, info: PanInfo) => {
		setIsDragging(false)

		if (info.offset.y > dragThreshold) {
			onClose()
		}
	}

	return (
		<Portal>
			<AnimatePresence>
				{isOpen && (
					<>
						<motion.div
							className={`fixed inset-0 z-50 ${isDragging ? '' : 'bg-black'}`}
							initial={{ opacity: 0 }}
							animate={{ opacity: 0.5 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3, ease: 'easeOut' }}
							onClick={closeOnBackdrop ? onClose : undefined}
						/>

						<motion.div
							className={`fixed left-0 right-0 ${isDragging ? 'z-10' : 'z-50'} bottom-16 min-w-2xl bg-base-200 bg-glass rounded-t-3xl`}
							style={{
								height: sizes[size],
								maxWidth: '390px',
								margin: '0 auto',
								touchAction: 'none',
							}}
							initial={{ y: '100%' }}
							animate={{ y: 0 }}
							exit={{ y: '100%' }}
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
									className="rounded-full bg-base-content/10"
									animate={{
										width: isDragging ? 16 : 28,
										scaleY: isDragging ? 0.7 : 1,
									}}
									transition={{ duration: 0.2 }}
									style={{ height: '3px' }}
								/>
							</div>

							{title && (
								<div className="relative flex items-center justify-center px-6 py-2">
									{showBack && (
										<button
											onClick={onClickBack}
											className="absolute p-2 transition-all duration-200 rounded-full right-6 active:scale-95"
											aria-label="بستن"
										>
											<HiChevronRight
												size={20}
												className="text-base-content/60"
											/>
										</button>
									)}
									<h2 className="text-sm font-bold text-content">
										{title}
									</h2>
								</div>
							)}

							<div
								className="px-2 py-1 mt-1 overflow-y-auto scrollbar-none"
								style={{
									height: title
										? `calc(${sizes[size]} - 40px)`
										: `calc(${sizes[size]} - 30px)`,
									WebkitOverflowScrolling: 'touch',
								}}
							>
								{children}
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</Portal>
	)
}
