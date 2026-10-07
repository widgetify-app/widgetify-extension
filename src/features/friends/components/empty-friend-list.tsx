import { Icon } from '@/icons'

interface Prop {
	emptyMessage?: string
}
export function FriendEmptyList({ emptyMessage }: Prop) {
	return (
		<div className="flex flex-col items-center justify-center px-6 py-12 text-center">
			<div className="relative mb-5">
				<div className="flex items-center justify-center w-16 h-16 rounded-xl bg-surface-2">
					<Icon name="users" className="text-fg" size={24} />
				</div>
				<div className="absolute inset-0 rounded-full bg-surface-2 blur-xl opacity-40" />
			</div>

			{emptyMessage ? (
				<p className="text-sm font-medium text-fg-muted">{emptyMessage}</p>
			) : (
				''
			)}

			<p className="mt-1 text-xs text-fg-faint">هنوز چیزی اینجا نیست</p>
		</div>
	)
}
