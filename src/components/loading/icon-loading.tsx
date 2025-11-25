import { FiLoader } from 'react-icons/fi'
import Tooltip from '../toolTip'

interface IconLoadingProps {
	title?: string
	className?: string
}
export function IconLoading({ title, className }: IconLoadingProps) {
	if (!title) {
		return (
			<FiLoader
				className={`mx-2 block w-4 h-4 animate-spin text-content ${className}`}
			/>
		)
	}
	return (
		<Tooltip content={title} position="bottom">
			<FiLoader
				className={`mx-2 block w-4 h-4 animate-spin text-content ${className}`}
			/>
		</Tooltip>
	)
}
