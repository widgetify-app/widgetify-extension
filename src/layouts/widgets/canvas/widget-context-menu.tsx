import { Icon } from '@/src/icons'
import type { StoredWidget, WidgetDefinition, WidgetSize } from '../layout-engine/types'
import {
	Chip,
	PopoverMenu,
	PopoverMenuItem,
	PopoverMenuDivider,
	VipBadge,
} from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { useWidgetVipResolver } from '@/services/hooks/widgets/widget-catalog.hook'
import { callEvent } from '@/common/utils/call-event'
import { cn } from '@/common/utils/cn'

interface WidgetContextMenuProps {
	x: number
	y: number
	widget: StoredWidget
	definition: WidgetDefinition
	cols: number
	onClose: () => void
	onResize: (size: WidgetSize) => void
	onDuplicate: () => void
	onMove?: () => void
	onSettings?: () => void
	onEditVariant?: () => void
	onDelete: () => void
}

export function WidgetContextMenu({
	x,
	y,
	widget,
	definition,
	cols,
	onClose,
	onResize,
	onDuplicate,
	onMove,
	onSettings,
	onEditVariant,
	onDelete,
}: WidgetContextMenuProps) {
	const { isVip } = useAuth()
	const { isSizeVipOnly } = useWidgetVipResolver()

	const hasVariants = Boolean(definition.variants && definition.variants.length > 0)
	const fittingSizes = definition.allowedSizes.filter((s) => s.w <= cols)
	const showResize =
		(!hasVariants || definition.canResize === true) && fittingSizes.length > 1

	return (
		<PopoverMenu
			isOpen={true}
			onClose={onClose}
			position={{ x, y }}
			width={208}
		>
			<div className="flex items-center justify-between px-2 py-1">
				<span className="font-bold text-content flex items-center gap-1.5">
					<span>{definition.emoji}</span>
					<span>{definition.label}</span>
				</span>
			</div>

			{showResize && (
				<div className="px-2 py-1 flex flex-col gap-1.5 border-t border-base-content/10">
					<span className="text-[11px] text-muted font-medium">
						تغییر اندازه
					</span>
					<div dir="ltr" className="grid grid-cols-3 gap-1">
						{fittingSizes.map((size) => {
							const isCurrent =
								size.w === widget.size.w && size.h === widget.size.h
							const isSizeVip = !isVip && isSizeVipOnly(definition.id, size)

							return (
								<Chip
									key={`${size.w}x${size.h}`}
									onClick={() => {
										if (isSizeVip && !isVip) {
											callEvent('openSettings', 'vip')
											onClose()
											return
										}
										onResize(size)
										onClose()
									}}
									selected={isCurrent}
									className={cn(
										'py-0.5 flex items-center justify-center gap-0.5',
										isSizeVip && !isCurrent && 'border-indigo-500/30'
									)}
								>
									<span>
										{size.w}×{size.h}
									</span>
									{isSizeVip && (
										<VipBadge
											size="xs"
											iconOnly
											variant={
												isCurrent ? 'white' : 'indigo-subtle'
											}
										/>
									)}
								</Chip>
							)
						})}
					</div>
				</div>
			)}

			<PopoverMenuDivider />

			{onMove && (
				<PopoverMenuItem
					icon={<Icon name="outlineDrag" size={14} />}
					label="جابجایی"
					onClick={() => {
						onMove()
						onClose()
					}}
				/>
			)}

			{onEditVariant && (
				<PopoverMenuItem
					icon={<Icon name="brush" size={14} />}
					label="تغییر مدل و استایل"
					onClick={() => {
						onEditVariant()
						onClose()
					}}
				/>
			)}

			{onDuplicate && definition.canDuplicate && (
				<PopoverMenuItem
					icon={<Icon name="copy" size={14} />}
					label="تکرار ویجت"
					badge={!isVip ? <VipBadge size="xs" /> : undefined}
					onClick={() => {
						if (!isVip) {
							callEvent('openSettings', 'vip')
							onClose()
							return
						}
						onDuplicate()
						onClose()
					}}
				/>
			)}

			{onSettings && (
				<PopoverMenuItem
					icon={<Icon name="settings" size={14} />}
					label="تنظیمات"
					onClick={() => {
						onSettings()
						onClose()
					}}
				/>
			)}

			<PopoverMenuDivider />

			<PopoverMenuItem
				icon={<Icon name="trash" size={14} />}
				label="حذف ویجت"
				variant="danger"
				onClick={() => {
					onDelete()
					onClose()
				}}
			/>
		</PopoverMenu>
	)
}
