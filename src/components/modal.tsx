import { AnimatePresence, motion } from 'framer-motion'
import { type ReactNode, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { AiOutlineClose } from 'react-icons/ai'

type ModalProps = {
	isOpen: boolean
	onClose: () => void
	title?: string
	size?: 'sm' | 'md' | 'lg' | 'xl'
	children: ReactNode
	direction?: 'rtl' | 'ltr'
	closeOnBackdropClick?: boolean
	showCloseButton?: boolean
}

const sizeClasses = {
	sm: 'w-full max-w-sm',
	md: 'w-full max-w-md',
	lg: 'w-full max-w-lg',
	xl: 'w-full max-w-4xl overflow-y-auto max-h-[80vh]',
}

const Modal = ({
	isOpen,
	onClose,
	title,
	size = 'md',
	children,
	closeOnBackdropClick = true,
	direction = 'ltr',
	showCloseButton = true,
}: ModalProps) => {
	useEffect(() => {
		if (isOpen) {
			const scrollY = window.scrollY

			document.body.style.position = 'fixed'
			document.body.style.top = `-${scrollY}px`
			document.body.style.width = '100%'
			document.body.style.overflowY = 'scroll'

			return () => {
				document.body.style.position = ''
				document.body.style.top = ''
				document.body.style.width = ''
				document.body.style.overflowY = ''

				window.scrollTo(0, scrollY)
			}
		}
	}, [isOpen])

	if (!isOpen) return null

	return ReactDOM.createPortal(
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
					className={`custom-modal-bg border border-gray-700/30 shadow-2xl rounded-2xl ${sizeClasses[size]}`}
					initial={{ scale: 0.95, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.95, opacity: 0 }}
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex items-center justify-between p-4 border-b border-gray-700/30">
						{title && <h2 className="text-lg font-semibold text-gray-200">{title}</h2>}
						{showCloseButton ? (
							<button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700/30">
								<AiOutlineClose size={20} className="text-gray-200" />
							</button>
						) : null}
					</div>
					<div className={`p-4 ${size === 'xl' ? 'overflow-y-auto' : ''}`}>
						{children}
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>,
		document.body,
	)
}

export default Modal
