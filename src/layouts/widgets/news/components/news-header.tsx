import { Button } from '@/components/ui'
import { Icon } from '@/src/icons'

interface NewsHeaderProps {
	title?: string
	onSettingsClick: () => void
}

export const NewsHeader = ({ title = 'اخبار', onSettingsClick }: NewsHeaderProps) => {
	return (
		<div className={'top-0 z-20 flex items-center justify-between w-full pb-2'}>
			<div className="flex items-center gap-1.5">
				<span className="text-base leading-none">📰</span>
				<p className="text-base font-medium">{title}</p>
			</div>

			<div className="flex items-center gap-x-0.5">
				<Button
					onClick={onSettingsClick}
					size="xs"
					className="h-6 w-6 p-0 flex items-center justify-center rounded-full !border-none !shadow-none hover:bg-base-300"
				>
					<Icon
						name="menuOption"
						size={12}
						className="text-content opacity-70 hover:opacity-100"
					/>
				</Button>
			</div>
		</div>
	)
}
