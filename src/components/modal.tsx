import { useEffect, type ReactNode } from 'react'
import ReactDOM from 'react-dom'

type ModalProps = {
	isOpen: boolean
	onClose: () => void
	title?: string
	size?: 'sm' | 'md' | 'lg' | 'xl'
	children: ReactNode
	direction?: 'rtl' | 'ltr'
	closeOnBackdropClick?: boolean
	showCloseButton?: boolean
	className?: string
}

const daisyUISizeClasses = {
	sm: 'max-w-sm max-h-[70vh]',
	md: 'max-w-md max-h-[80vh]',
	lg: 'max-w-lg max-h-[85vh]',
	xl: 'max-w-4xl max-h-[90vh]',
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
	className = '',
}: ModalProps) => {

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose()
			}
		}

		if (isOpen) {
			document.addEventListener('keydown', handleKeyDown)
	 
		}

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [isOpen, onClose])

	if (!isOpen) return null

	return ReactDOM.createPortal(
		<dialog
			open
			className="modal modal-middle"
			onClick={() => {
				if (closeOnBackdropClick) {
					onClose()
				}
			}}
			onClose={onClose}
			dir={direction}
		>
			<div
				className={`modal-box ${daisyUISizeClasses[size]} ${className}`}
				onClick={(e) => e.stopPropagation()}
			>
				{showCloseButton && (
					<button
						onClick={onClose}
						className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2"
						aria-label="Close"
					>
						✕
					</button>
				)}
				{title && (
					<h3 className={`font-bold text-lg ${showCloseButton ? 'mr-8' : ''}`}>
						{title}
					</h3>
				)}
				<div className="py-4">{children}</div>
			</div>
		</dialog>,
		document.body,
	)
}

export default Modal
