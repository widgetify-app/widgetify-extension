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
	xl: 'w-[60vw] h-[60vh] max-h-[80vh] overflow-hidden',
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
	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={closeOnBackdropClick ? onClose : undefined}
					dir={direction}
				>
					<motion.div
						className={`bg-[#1c1c1c]  shadow-xl rounded-2xl p-6 ${sizeClasses[size]}`}
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						onClick={(e: any) => e.stopPropagation()}
					>
						<div className="flex items-center justify-between mb-4">
							{title && <h2 className="text-lg font-semibold text-gray-200">{title}</h2>}
							<button
								onClick={onClose}
								className="flex text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
							>
								<AiOutlineClose size={20} />
							</button>
						</div>
						<div>{children}</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export default Modal
