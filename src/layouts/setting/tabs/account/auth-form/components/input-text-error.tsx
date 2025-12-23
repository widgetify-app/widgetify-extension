import { twMerge } from 'tailwind-merge'

type InputTextErrorProps = {
	message?: string | null
	className?: string
}

const InputTextError: React.FC<InputTextErrorProps> = ({ message, className }) => {
	const hasError = Boolean(message)

	const classes = twMerge(
		'text-xs text-red-500 flex items-center gap-1.5  transition-all duration-300  ease-in-out overflow-hidden',
		hasError
			? 'opacity-100 translate-y-0 mt-1 min-h-[20px]'
			: 'opacity-0 -translate-y-1 pointer-events-none',
		className
	)

	return (
		<div
			className={classes}
			role={hasError ? 'alert' : undefined}
			aria-live={hasError ? 'polite' : undefined}
			aria-hidden={!hasError}
		>
			{hasError && (
				<>
					<span
						aria-hidden="true"
						className="block w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_4px_1px_rgba(239,68,68,0.6)] flex-shrink-0 animate-pulse"
					/>
					<span className="leading-relaxed">{message}</span>
				</>
			)}
		</div>
	)
}

export default InputTextError
