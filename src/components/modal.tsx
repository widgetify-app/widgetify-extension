import { type ReactNode, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { LuX } from 'react-icons/lu'

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
	// sm: 'max-w-sm max-h-[70vh] overflow-y-auto',
	// md: 'max-w-md max-h-[80vh] overflow-y-auto',
	// lg: 'max-w-lg max-h-[85vh] overflow-y-auto',
	// xl: 'max-w-4xl max-h-[90vh] overflow-y-auto',
	sm: {
		w: 'max-w-sm',
		h: 'max-h-[70vh]',
		overflow: 'overflow-y-auto',
	},
	md: {
		w: 'max-w-md',
		h: 'max-h-[80vh]',
		overflow: 'overflow-y-auto',
	},
	lg: {
		w: 'max-w-lg',
		h: 'max-h-[85vh]',
		overflow: 'overflow-y-auto',
	},
	xl: {
		w: 'max-w-4xl',
		h: 'max-h-[90vh]',
		overflow: 'overflow-y-auto',
	},
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
	const sizValue = daisyUISizeClasses[size] || daisyUISizeClasses.md

	useEffect(() => {
		const html = document.documentElement
		if (isOpen) {
			html.classList.add('modal-isActive')
		} else {
			html.classList.remove('modal-isActive')
		}
		return () => {
			html.classList.remove('modal-isActive')
		}
	}, [isOpen])

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
				className={`modal-box overflow-hidden rounded-2xl ${sizValue.w} ${className} !p-4`}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-center justify-between w-full pr-2 mb-2">
					{title && <h3 className={'font-medium text-lg'}>{title}</h3>}
					{showCloseButton && (
						<div className={`${!title && 'mr-auto'} `}>
							<button
								onClick={onClose}
								className={
									'h-7 w-7 flex items-center justify-center bg-base-300 text-xs font-medium rounded-full transition-all border-none shadow-none text-muted cursor-pointer active:scale-95'
								}
								aria-label="Close"
							>
								<LuX size={16} />
							</button>
						</div>
					)}
				</div>
				<div className={`${sizValue.h} ${sizValue.overflow}`}>{children}</div>
			</div>
		</dialog>,
		document.body
	)
}

export default Modal
