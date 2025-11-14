interface ItemPriceProps {
	price: number
	currency?: string
	className?: string
}

export function ItemPrice({
	price,
	currency = 'ویج‌کوین',
	className = '',
}: ItemPriceProps) {
	return (
		<div className={`flex items-center gap-1 text-sm font-medium ${className}`}>
			<img
				src="https://widgetify-ir.storage.c2.liara.space/extension/wig-icon.png"
				alt="ویج‌کوین"
				className="w-4 h-4"
			/>
			<span className="text-content">{price.toLocaleString('fa-IR')}</span>
			{currency && <span className="text-[10px] text-muted">{currency}</span>}
		</div>
	)
}
