import { Button } from '@/components/ui'
import { Icon } from '@/icons'
import { ITEM_TYPE_META } from '../../constants'
import type { StoreItem } from '../../types'

interface PurchaseSuccessProps {
	item: StoreItem
	canUseHere: boolean
	isApplying: boolean
	onUse: () => void
	onDone: () => void
}

export function PurchaseSuccess({
	item,
	canUseHere,
	isApplying,
	onUse,
	onDone,
}: PurchaseSuccessProps) {
	return (
		<div className="flex flex-col items-center gap-3 p-4 text-center rounded-2xl bg-success-fill">
			<span className="grid rounded-full shadow-md size-12 place-items-center bg-success text-on-success">
				<Icon name="check" size={24} />
			</span>
			<div className="space-y-1">
				<p className="text-sm font-bold text-fg-strong">
					«{item.name}» مال تو شد
				</p>
				<p className="text-2xs text-fg-muted">
					هر وقت خواستی از «{ITEM_TYPE_META[item.type].whereToChange}» انتخابش
					کن.
				</p>
			</div>
			{canUseHere ? (
				<div className="flex w-full gap-2">
					<Button
						color="brand"
						className="flex-1"
						onClick={onUse}
						loading={isApplying}
						loadingText="داریم عوضش می‌کنیم..."
					>
						همین الان استفاده کن
					</Button>
					<Button variant="ghost" onClick={onDone}>
						بعداً
					</Button>
				</div>
			) : (
				<Button variant="ghost" fullWidth onClick={onDone}>
					باشه
				</Button>
			)}
		</div>
	)
}
