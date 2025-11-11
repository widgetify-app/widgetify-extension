import { FaGear, FaRss } from 'react-icons/fa6'
import { Button } from '@/components/button/button'

interface NewsHeaderProps {
	title: string
	onSettingsClick: () => void
}

export const NewsHeader = ({ title, onSettingsClick }: NewsHeaderProps) => {
	return (
		<div className={'top-0 z-20 flex items-center justify-between w-full pb-2'}>
			<div className="flex flex-col">
				<div className="flex items-center gap-1.5">
					<FaRss className="w-3.5 h-3.5 opacity-70" />
					<p className="text-base font-medium">{title}</p>
				</div>
			</div>

			<div className="flex items-center gap-x-0.5">
				<Button
					onClick={onSettingsClick}
					size="xs"
					className="h-6 w-6 p-0 flex items-center justify-center rounded-full !border-none !shadow-none"
				>
					<FaGear
						size={12}
						className="text-content opacity-70 hover:opacity-100"
					/>
				</Button>
			</div>
		</div>
	)
}
