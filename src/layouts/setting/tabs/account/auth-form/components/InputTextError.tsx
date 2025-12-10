import { twMerge } from 'tailwind-merge'

type InputTextErrorProps = {
	message: string
	className?: string | null
}

const InputTextError: React.FC<InputTextErrorProps> = ({ message, className }) => {
	const classes = twMerge(
		'mt-1.5 text-xs text-red-500 flex items-center gap-1.5 transition-all',
		className
	)

	return (
		<p className={classes}>
			<span className="block w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_6px_2px_rgba(239,68,68,0.7)]" />
			{message}
		</p>
	)
}

export default InputTextError
