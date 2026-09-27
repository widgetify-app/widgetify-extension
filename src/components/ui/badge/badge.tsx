import { twMerge } from 'tailwind-merge'
interface Prop {
	className: string
}
export function NewBadge({ className }: Prop) {
	return (
		<span
			className={twMerge(
				'absolute w-2 h-2 rounded-full bg-danger animate-pulse ring-2 ring-danger-fill-2',
				className
			)}
		></span>
	)
}
