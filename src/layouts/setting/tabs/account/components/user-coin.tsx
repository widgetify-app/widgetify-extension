import { BiSolidCoin } from 'react-icons/bi'
import Tooltip from '@/components/toolTip'

interface Prop {
	coins: number
}
export function UserCoin({ coins }: Prop) {
	return (
		<Tooltip content="سکه">
			<div className="flex items-center gap-1.5 px-3 py-1 border border-warning/20 bg-warning/10 rounded-2xl">
				<BiSolidCoin size={18} className="text-warning" />
				<span className="text-sm font-normal text-warning">
					{coins.toLocaleString() || '۰'}
				</span>
			</div>
		</Tooltip>
	)
}
