import Analytics from '@/analytics'
import { showToast } from '@/common/toast'
import {
	Badge,
	PopoverMenu,
	PopoverMenuDivider,
	PopoverMenuHeader,
	PopoverMenuItem,
} from '@/components/ui'
import { Icon } from '@/icons'
import type { CatalogItem } from '../types'

interface ExplorerPopoverMenuProps {
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
		Analytics.event('explorer_site_opened')
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
							className="w-4 h-4 rounded-lg object-contain shrink-0"
						/>
					)}
					<span className="font-bold text-fg text-xs truncate">{title}</span>
				</div>
				{item.badge || meta?.badge || promo?.badge ? (
					<Badge variant="neutral">
						{item.badge || meta?.badge || promo?.badge}
					</Badge>
				) : null}
			</PopoverMenuHeader>

			{meta?.description && (
				<p className="px-2.5 py-0.5 text-3xs text-fg-muted leading-tight truncate">
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
							<Badge variant="ghost">{mItem.badge}</Badge>
						) : undefined
					}
					icon={
						<Icon name="externalLink" size={12} className="text-fg-muted" />
					}
					onClick={() => handleItemClick(mItem.url)}
				/>
			))}

			{promo?.code && (
				<>
					<PopoverMenuDivider />
					<div className="p-2 rounded-xl bg-fill-2 border border-surface-3 my-1 space-y-1.5">
						<div className="flex items-center justify-between text-2xs">
							<span className="font-medium text-fg">
								{promo.title || 'کد تخفیف'}
							</span>
							{promo.discount && (
								<span className="font-bold text-brand text-3xs">
									{promo.discount}
								</span>
							)}
						</div>
						<div className="flex items-center justify-between bg-surface border border-surface-3 rounded-lg px-2 py-1 gap-2">
							<span className="font-mono text-xs font-bold text-brand tracking-wider select-all">
								{promo.code}
							</span>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation()
									handleCopy(promo.code)
								}}
								className="text-3xs font-medium px-2 py-0.5 rounded-lg bg-surface-2 hover:bg-surface-3 text-fg transition-colors cursor-pointer"
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
					icon={<Icon name="externalLink" size={12} />}
					onClick={() => handleItemClick(item.url)}
				/>
			)}
		</PopoverMenu>
	)
}
