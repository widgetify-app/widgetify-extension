import { AnimatePresence, motion } from 'motion/react'
import type { ReactNode } from 'react'
import { AiOutlineClose } from 'react-icons/ai'

type ModalProps = {
	isOpen: boolean
	onClose: () => void
	title?: string
	size?: 'sm' | 'md' | 'lg' | 'xl'
	children: ReactNode
	direction?: 'rtl' | 'ltr'
	closeOnBackdropClick?: boolean
}

const sizeClasses = {
	sm: 'w-full max-w-sm',
	md: 'w-full max-w-md',
	lg: 'w-full max-w-lg',
	xl: 'w-[60vw] max-h-[80vh] overflow-hidden',
}

const Modal = ({
	isOpen,
	onClose,
	title,
	size = 'md',
	children,
	closeOnBackdropClick = true,
	direction = 'ltr',
}: ModalProps) => {
	if (!isOpen) return null

	return (
		<AnimatePresence>
			<motion.div
				className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				onClick={closeOnBackdropClick ? onClose : undefined}
				dir={direction}
			>
				<motion.div
					className={`bg-[#1c1c1c]/80 backdrop-blur-lg border border-gray-700/30 shadow-2xl rounded-2xl ${sizeClasses[size]}`}
					initial={{ scale: 0.95, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.95, opacity: 0 }}
					onClick={(e: any) => e.stopPropagation()}
				>
					<div className="flex items-center justify-between p-4 border-b border-gray-700/30">
						{title && (
							<h2 className="text-lg font-semibold text-gray-200 font-[Vazir]">
								{title}
							</h2>
						)}
						<button
							onClick={onClose}
							className="p-1 text-gray-400 transition-colors rounded-lg hover:bg-gray-700/30 hover:text-gray-200"
						>
							<AiOutlineClose size={20} />
						</button>
					</div>
					<div className="p-4">{children}</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	)
}

export default Modal
