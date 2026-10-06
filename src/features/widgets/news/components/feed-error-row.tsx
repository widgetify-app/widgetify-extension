import { Button } from '@/components/ui'
import { Icon } from '@/icons'

interface FeedErrorRowProps {
	label: string
	onRetry: () => void
}

export function FeedErrorRow({ label, onRetry }: FeedErrorRowProps) {
	return (
		<li className="flex items-center flex-none gap-2.5 px-2 min-h-10 rounded-xl bg-fill text-2xs text-fg-muted">
			<Icon
				name="alert"
				size={14}
				className="flex-none text-fg-faint"
				aria-hidden="true"
			/>
			<span className="flex-1 min-w-0 truncate">نتونستیم «{label}» رو بیاریم</span>
			<Button size="xs" color="base" rounded="lg" onClick={onRetry}>
				دوباره امتحان کن
			</Button>
		</li>
	)
}
