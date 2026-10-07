import { Icon } from '@/icons'

const FAVICON = './icons/icon16.png'

export function TabTitlePreview({ title }: { title: string }) {
	return (
		<span
			aria-hidden="true"
			dir="ltr"
			className="absolute inset-0 flex items-end gap-1 px-3 pt-4 bg-fill-2"
		>
			<span className="relative flex items-center flex-1 min-w-0 h-8 gap-1.5 px-2.5 rounded-t-lg bg-surface shadow-sm">
				<img src={FAVICON} alt="" className="size-3.5 shrink-0" />
				<span
					dir="auto"
					className="flex-1 min-w-0 text-xs font-medium truncate text-fg-strong"
				>
					{title}
				</span>
				<Icon name="close" size={12} className="shrink-0 text-fg-faint" />
			</span>
			<span className="grid w-6 h-8 place-items-center shrink-0 text-fg-faint">
				<Icon name="plus" size={14} />
			</span>
		</span>
	)
}
