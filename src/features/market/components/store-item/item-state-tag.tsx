import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'
import type { ItemState } from '../../types'
import { CoinAmount } from './coin-amount'

const TAG = 'inline-flex items-center gap-1 h-6 px-2 rounded-lg text-2xs font-semibold'

export function ItemStateTag({ state, price }: { state: ItemState; price: number }) {
	if (state === 'locked') return <CoinAmount amount={price} />
	if (state === 'active') {
		return (
			<span className={cn(TAG, 'bg-brand-fill text-brand')}>
				<Icon name="check" size={12} />
				فعاله
			</span>
		)
	}
	if (state === 'owned') {
		return (
			<span className={cn(TAG, 'bg-success-fill text-fg')}>
				<Icon name="check" size={12} className="text-success" />
				مال توئه
			</span>
		)
	}
	return <span className={cn(TAG, 'bg-fill-2 text-fg')}>رایگان</span>
}
