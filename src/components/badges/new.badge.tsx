interface Prop {
	className: string
}
export function NewBadge({ className }: Prop) {
	return (
		<span
			className={`absolute w-2 h-2 rounded-full ${className} bg-error animate-pulse`}
		></span>
	)
}
