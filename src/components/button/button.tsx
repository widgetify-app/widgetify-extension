interface ButtonProps {
	onClick?: () => void
	disabled?: boolean
	className?: string
	style?: React.CSSProperties
	icon?: React.ReactNode
	loading?: boolean
	loadingText?: string
	type?: 'button' | 'submit' | 'reset'
	fullWidth?: boolean
	rounded?: 'sm' | 'md' | 'lg' | 'xl'
	children?: React.ReactNode
	isPrimary?: boolean
	size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}
export function Button(prop: ButtonProps) {
	return (
		<button
			type={prop.type || 'button'}
			onClick={prop.onClick}
			disabled={prop.disabled}
			className={`btn cursor-pointer  ${prop.fullWidth ? 'full-width' : ''} ${prop.className} ${prop.rounded ? `rounded-${prop.rounded}` : ''} ${prop.isPrimary ? 'btn-primary' : ''} btn-${prop.size}`}
			style={prop.style}
		>
			{prop.loading ? prop.loadingText : prop.children}
		</button>
	)
}
