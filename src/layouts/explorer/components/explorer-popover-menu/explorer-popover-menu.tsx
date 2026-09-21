import { showToast } from '@/common/toast'
import {
	PopoverMenu,
	PopoverMenuDivider,
	PopoverMenuHeader,
	PopoverMenuItem,
} from '@/components/ui'
import { Icon } from '@/icons'
import type { CatalogItem } from '../../interfaces/catalog-item.interface'

export interface ExplorerPopoverMenuProps {
	isOpen: boolean
	onClose: () => void
	item: CatalogItem | null
	triggerRef?: React.RefObject<HTMLElement | null>
	position?: { x: number; y: number } | null
}

export function ExplorerPopoverMenu({
	isOpen,
	onClose,
	item,
	triggerRef,
	position,
}: ExplorerPopoverMenuProps) {
	if (!item) return null

	const meta = item.meta
	const title = meta?.title || item.name
	const menuItems = Array.isArray(meta?.menuItems) ? meta.menuItems : []
	const promo = meta?.promo

	const handleItemClick = (url: string) => {
		if (!url) return
		const targetUrl = url.startsWith('http') ? url : `https://${url}`
		window.open(targetUrl, '_blank', 'noopener,noreferrer')
		onClose()
	}

	const handleCopy = (code?: string) => {
		if (!code) return
		navigator.clipboard.writeText(code)
		showToast(`کد تخفیف ${code} کپی شد`, 'success')
	}

	return (
		<PopoverMenu
			isOpen={isOpen}
			onClose={onClose}
			triggerRef={triggerRef}
			position={position}
			width={250}
			placement="bottom-start"
			className="p-1.5"
		>
			{/* Header */}
			<PopoverMenuHeader>
				<div className="flex items-center gap-2 min-w-0">
					{item.icon && (
						<img
							src={item.icon}
							alt={title}
							className="w-4 h-4 rounded-md object-contain shrink-0"
						/>
					)}
					<span className="font-bold text-content text-xs truncate">
						{title}
					</span>
				</div>
				{item.badge || meta?.badge || promo?.badge ? (
					<span className="badge badge-xs badge-neutral shrink-0">
						{item.badge || meta?.badge || promo?.badge}
					</span>
				) : null}
			</PopoverMenuHeader>

			{meta?.description && (
				<p className="px-2.5 py-0.5 text-[10px] text-muted leading-tight truncate">
					{meta.description}
				</p>
			)}

			{menuItems.length ? <PopoverMenuDivider /> : null}

			{/* Dynamic Menu Items */}
			{menuItems.map((mItem, idx) => (
				<PopoverMenuItem
					key={idx}
					label={mItem.title}
					badge={
						mItem.badge ? (
							<span className="badge badge-xs badge-ghost">
								{mItem.badge}
							</span>
						) : undefined
					}
					icon={<Icon name="externalLink" size={13} className="text-muted" />}
					onClick={() => handleItemClick(mItem.url)}
				/>
			))}

			{promo?.code && (
				<>
					<PopoverMenuDivider />
					<div className="p-2 rounded-xl bg-base-200/70 border border-content my-1 space-y-1.5">
						<div className="flex items-center justify-between text-[11px]">
							<span className="font-medium text-content">
								{promo.title || 'کد تخفیف'}
							</span>
							{promo.discount && (
								<span className="font-bold text-primary text-[10px]">
									{promo.discount}
								</span>
							)}
						</div>
						<div className="flex items-center justify-between bg-base-100 border border-content rounded-lg px-2 py-1 gap-2">
							<span className="font-mono text-xs font-bold text-primary tracking-wider select-all">
								{promo.code}
							</span>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation()
									handleCopy(promo.code)
								}}
								className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-base-200 hover:bg-base-300 text-content transition-colors cursor-pointer"
							>
								کپی
							</button>
						</div>
					</div>
				</>
			)}

			{menuItems.length === 0 && item.url && (
				<PopoverMenuItem
					label="مشاهده و ورود"
					icon={<Icon name="externalLink" size={13} />}
					onClick={() => handleItemClick(item.url)}
				/>
			)}
		</PopoverMenu>
	)
}
