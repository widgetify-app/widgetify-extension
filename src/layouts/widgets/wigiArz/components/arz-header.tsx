import { Button } from '@/components/button/button'
import { BsCurrencyExchange } from 'react-icons/bs'
import { FiSettings } from 'react-icons/fi'

interface ArzHeaderProps {
	title: string
	onSettingsClick: () => void
}

export const ArzHeader = ({ title, onSettingsClick }: ArzHeaderProps) => {
	return (
		<div className={'top-0 z-20 pb-2 flex items-center justify-between w-full'}>
			<div className="flex items-center gap-1.5">
				<BsCurrencyExchange className="w-3.5 h-3.5 opacity-70" />
				<p className="text-base font-medium">{title}</p>
			</div>

			<div className="flex items-center gap-x-0.5">
				<Button
					onClick={onSettingsClick}
					size="xs"
					className="h-6 w-6 p-0 flex items-center justify-center rounded-full !border-none !shadow-none"
				>
					<FiSettings size={12} className="text-content" />
				</Button>
			</div>
		</div>
	)
}
