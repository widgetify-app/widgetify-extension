import { Icon } from '@/src/icons'
import Tooltip from '../toolTip'

interface IconLoadingProps {
	title?: string
	className?: string
}
export function IconLoading({ title, className }: IconLoadingProps) {
	if (!title) {
		return (
			<Icon
				name="loader"
				className={`mx-2 block w-4 h-4 animate-spin text-content ${className}`}
			/>
		)
	}
	return (
		<Tooltip content={title} position="bottom">
			<Icon
				name="loader"
				className={`mx-2 block w-4 h-4 animate-spin text-content ${className}`}
			/>
		</Tooltip>
	)
}
