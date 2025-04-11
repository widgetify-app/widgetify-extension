import { useTheme } from '@/context/theme.context'
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
	sm: 'w-full max-w-sm max-h-[70vh] overflow-hidden',
	md: 'w-full max-w-md max-h-[80vh] overflow-hidden',
	lg: 'w-full max-w-lg max-h-[85vh] overflow-hidden',
	xl: 'w-full max-w-4xl max-h-[90vh] overflow-hidden',
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
	const { theme, themeUtils } = useTheme()

	const getModalStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-white border border-gray-300/30 shadow-xl'
			case 'dark':
				return 'bg-neutral-900 border border-gray-700/40 shadow-2xl'
			default: // glass
				return 'custom-modal-bg border border-gray-700/30 shadow-2xl'
		}
	}

	const getHeaderBorderStyle = () => {
		switch (theme) {
			case 'light':
				return 'border-gray-300/30'
			case 'dark':
				return 'border-gray-700/40'
			default: // glass
				return 'border-gray-700/30'
		}
	}

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
					className={`${getModalStyle()} rounded-2xl ${sizeClasses[size]} mx-5`}
					initial={{ scale: 0.95, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.95, opacity: 0 }}
					onClick={(e) => e.stopPropagation()}
				>
					<div
						className={`flex items-center justify-between p-4 border-b ${getHeaderBorderStyle()}`}
					>
						{title && (
							<h2 className={`text-lg font-semibold ${themeUtils.getTextColor()}`}>
								{title}
							</h2>
						)}
						{showCloseButton ? (
							<button
								onClick={onClose}
								className={`p-2 cursor-pointer rounded-full ${theme === 'light' ? 'hover:bg-gray-200/80' : 'hover:bg-gray-700/30'}`}
							>
								<AiOutlineClose
									size={20}
									className={theme === 'light' ? 'text-gray-700' : 'text-gray-200'}
								/>
							</button>
						) : null}
					</div>
					<div className={'xl:p-4 p-2'}>{children}</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>,
		document.body,
	)
}

export default Modal
