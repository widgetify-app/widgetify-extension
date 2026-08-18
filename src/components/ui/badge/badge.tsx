import { twMerge } from 'tailwind-merge'
interface Prop {
	className: string
}
export function NewBadge({ className }: Prop) {
	return (
		<span
			className={twMerge(
				'absolute w-2 h-2 rounded-full bg-error animate-pulse ring-2 ring-error/20',
				className
			)}
		></span>
	)
}
