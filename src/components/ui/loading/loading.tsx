import { cn } from '@/common/utils/cn'
import { Icon } from '@/src/icons'
import { Tooltip } from '../tooltip/tooltip'

interface IconLoadingProps {
	title?: string
	className?: string
}

export function IconLoading({ title, className }: IconLoadingProps) {
	const icon = (
		<Icon
			name="loader"
			className={cn('mx-2 block w-4 h-4 animate-spin text-content', className)}
		/>
	)

	if (!title) return icon

	return (
		<Tooltip content={title} position="bottom">
			{icon}
		</Tooltip>
	)
}
