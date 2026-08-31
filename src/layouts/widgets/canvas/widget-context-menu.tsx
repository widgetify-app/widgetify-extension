import { useEffect, useRef } from 'react'
import { Motion } from '@/common/motion'
import { Icon } from '@/src/icons'
import type { StoredWidget, WidgetDefinition, WidgetSize } from '../layout-engine/types'
import { Chip, VipBadge } from '@/components/ui'
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
	const menuRef = useRef<HTMLDivElement>(null)
	const { isVip } = useAuth()
	const { isSizeVipOnly } = useWidgetVipResolver()

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				onClose()
			}
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose()
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		document.addEventListener('keydown', handleKeyDown)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [onClose])

	const hasVariants = Boolean(definition.variants && definition.variants.length > 0)
	const fittingSizes = definition.allowedSizes.filter((s) => s.w <= cols)
	const showResize =
		(!hasVariants || definition.canResize === true) && fittingSizes.length > 1

	const adjustedLeft = Math.min(Math.max(10, x), window.innerWidth - 220)
	const adjustedTop = Math.min(Math.max(10, y), window.innerHeight - 260)

	return (
		<Motion.div
			ref={menuRef}
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.15, ease: 'easeOut' }}
			style={{
				position: 'fixed',
				left: adjustedLeft,
				top: adjustedTop,
				zIndex: 9999,
			}}
			className="w-52 bg-base-200/95 backdrop-blur-md rounded-2xl shadow-2xl border border-base-content/10 p-2 text-right text-xs flex flex-col gap-1.5"
			onClick={(e) => e.stopPropagation()}
			onContextMenu={(e) => e.preventDefault()}
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

			<div className="h-px bg-base-content/10 my-0.5" />

			{onMove && (
				<button
					type="button"
					onClick={() => {
						onMove()
						onClose()
					}}
					className="w-full px-2 py-1.5 rounded-xl hover:bg-base-300 text-content text-right flex items-center gap-2 cursor-pointer transition-colors"
				>
					<Icon name="outlineDrag" size={14} className="text-muted" />
					<span>جابجایی</span>
				</button>
			)}

			{onEditVariant && (
				<button
					type="button"
					onClick={() => {
						onEditVariant()
						onClose()
					}}
					className="w-full px-2 py-1.5 rounded-xl hover:bg-base-300 text-content text-right flex items-center gap-2 cursor-pointer transition-colors"
				>
					<Icon name="brush" size={14} className="text-muted" />
					<span>تغییر مدل و استایل</span>
				</button>
			)}

			{onDuplicate && definition.canDuplicate && (
				<button
					type="button"
					onClick={() => {
						if (!isVip) {
							callEvent('openSettings', 'vip')
							onClose()
							return
						}
						onDuplicate()
						onClose()
					}}
					className="w-full px-2 py-1.5 rounded-xl hover:bg-base-300 text-content text-right flex items-center justify-between cursor-pointer transition-colors"
				>
					<div className="flex items-center gap-2">
						<Icon name="copy" size={14} className="text-muted" />
						<span>تکرار ویجت</span>
					</div>
					{!isVip && <VipBadge size="xs" />}
				</button>
			)}

			{onSettings && (
				<button
					type="button"
					onClick={() => {
						onSettings()
						onClose()
					}}
					className="w-full px-2 py-1.5 rounded-xl hover:bg-base-300 text-content text-right flex items-center gap-2 cursor-pointer transition-colors"
				>
					<Icon name="settings" size={14} className="text-muted" />
					<span>تنظیمات</span>
				</button>
			)}

			<div className="h-px bg-base-content/10 my-0.5" />

			<button
				type="button"
				onClick={() => {
					onDelete()
					onClose()
				}}
				className="w-full px-2 py-1.5 rounded-xl hover:bg-error/15 text-error text-right flex items-center gap-2 cursor-pointer transition-colors"
			>
				<Icon name="trash" size={14} />
				<span>حذف ویجت</span>
			</button>
		</Motion.div>
	)
}
