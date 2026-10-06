import { Fragment, type ReactNode, type RefObject } from 'react'
import { Icon } from '@/icons'
import type {
	StoredWidget,
	WidgetDefinition,
	WidgetSize,
} from '../utils/layout-engine/types'
import {
	PopoverMenu,
	PopoverMenuItem,
	PopoverMenuDivider,
	VipBadge,
} from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { useWidgetVipResolver } from '@/features/widgets/hooks/use-widget-vip-resolver'
import { callEvent } from '@/common/utils/call-event'
import { cn } from '@/common/utils/cn'

export type WidgetMenuAnchor =
	| { point: { x: number; y: number } }
	| { trigger: RefObject<HTMLElement | null> }

interface WidgetContextMenuProps {
	anchor: WidgetMenuAnchor
	widget: StoredWidget
	definition: WidgetDefinition
	cols: number
	actions: ReactNode
	settingsSummary: string | null
	onClose: () => void
	onResize: (size: WidgetSize) => void
	onDuplicate: () => void
	onMove: () => void
	onSettings?: () => void
	onEditVariant?: () => void
	onDelete: () => void
}

export function WidgetContextMenu({
	anchor,
	widget,
	definition,
	cols,
	actions,
	settingsSummary,
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

	const menuLabel = definition.menuLabel ?? definition.label
	const hasVariants = Boolean(definition.variants && definition.variants.length > 0)
	const fittingSizes = definition.allowedSizes.filter((s) => s.w <= cols)
	const showResize =
		(!hasVariants || definition.canResize === true) && fittingSizes.length > 1

	const runAndClose = (action: () => void) => () => {
		action()
		onClose()
	}

	const openVip = runAndClose(() => callEvent('openSettings', 'vip'))

	const widgetGroup = (onSettings || actions) && (
		<>
			{onSettings && (
				<PopoverMenuItem
					icon={<Icon name="settings" size={14} />}
					label={`تنظیمات ${menuLabel}`}
					description={settingsSummary ?? undefined}
					badge={
						<Icon name="chevronLeft" size={14} className="text-fg-faint" />
					}
					onClick={runAndClose(onSettings)}
				/>
			)}
			{actions && (
				<div
					className="flex flex-col gap-1"
					onClickCapture={(e) => {
						if ((e.target as Element).closest('button')) setTimeout(onClose)
					}}
				>
					{actions}
				</div>
			)}
		</>
	)

	const sizeGroup = showResize && (
		<div className="flex flex-col gap-1.5 px-2.5 pt-1 pb-2">
			<span className="font-semibold text-2xs text-fg-faint">اندازه</span>
			<div
				dir="ltr"
				className={cn(
					'gap-1',
					fittingSizes.length > 4 ? 'grid grid-cols-3' : 'flex'
				)}
			>
				{fittingSizes.map((size) => {
					const isCurrent = size.w === widget.size.w && size.h === widget.size.h
					const isSizeVip = !isVip && isSizeVipOnly(definition.id, size)

					return (
						<button
							key={`${size.w}x${size.h}`}
							type="button"
							aria-pressed={isCurrent}
							onClick={
								isSizeVip ? openVip : runAndClose(() => onResize(size))
							}
							className={cn(
								'flex items-center justify-center flex-1 gap-0.5 h-6.5 rounded-lg text-2xs font-semibold tabular-nums cursor-pointer transition-ui focus-visible:focus-ring',
								isCurrent
									? 'bg-brand-fill text-brand ring-1 ring-inset ring-brand-muted'
									: 'bg-fill text-fg-muted hover:bg-fill-2 hover:text-fg'
							)}
						>
							{size.w}×{size.h}
							{isSizeVip && (
								<Icon
									name="diamond"
									size={8}
									className="text-vip"
									aria-label="پرو"
								/>
							)}
						</button>
					)
				})}
			</div>
		</div>
	)

	const layoutGroup = (
		<>
			{onEditVariant && (
				<PopoverMenuItem
					icon={<Icon name="brush" size={14} />}
					label="تغییر مدل و استایل"
					onClick={runAndClose(onEditVariant)}
				/>
			)}
			<PopoverMenuItem
				icon={<Icon name="move" size={14} />}
				label="جابجایی"
				onClick={runAndClose(onMove)}
			/>
			{definition.canDuplicate && (
				<PopoverMenuItem
					icon={<Icon name="copy" size={14} />}
					label="تکرار ویجت"
					badge={!isVip ? <VipBadge size="xs" /> : undefined}
					onClick={isVip ? runAndClose(onDuplicate) : openVip}
				/>
			)}
		</>
	)

	const deleteGroup = (
		<PopoverMenuItem
			icon={<Icon name="trash" size={14} />}
			label="حذف ویجت"
			variant="danger"
			onClick={runAndClose(onDelete)}
		/>
	)

	const groups = [widgetGroup, sizeGroup, layoutGroup, deleteGroup].filter(Boolean)

	return (
		<PopoverMenu
			isOpen={true}
			onClose={onClose}
			position={'point' in anchor ? anchor.point : undefined}
			triggerRef={'trigger' in anchor ? anchor.trigger : undefined}
			placement="bottom-start"
			width={228}
		>
			<div className="flex items-center gap-2 px-2 pt-1 pb-1.5">
				<span className="flex-1 text-xs font-bold truncate text-fg-strong">
					{menuLabel}
				</span>
				<span
					dir="ltr"
					className="text-2xs font-latin tabular-nums text-fg-faint"
				>
					{widget.size.w}×{widget.size.h}
				</span>
			</div>

			{groups.map((group, index) => (
				<Fragment key={index}>
					{index > 0 && <PopoverMenuDivider />}
					{group}
				</Fragment>
			))}
		</PopoverMenu>
	)
}
