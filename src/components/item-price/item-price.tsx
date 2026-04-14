import { ConfigKey } from '@/common/constant/config.key'

interface ItemPriceProps {
	price: number
	className?: string
}

export function ItemPrice({ price, className = '' }: ItemPriceProps) {
	return (
		<div className={`flex items-center gap-1 text-sm font-medium ${className}`}>
			<span className="text-content">
				{price === 0 ? 'رایگان' : price?.toLocaleString('fa-IR')}
			</span>
			<img src={ConfigKey.WIG_COIN_ICON} alt="ویج‌کوین" className="w-5 h-5" />
		</div>
	)
}
