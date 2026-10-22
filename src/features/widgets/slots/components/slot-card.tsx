import { useEffect, useRef, useState } from 'react'
import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import {
	Button,
	PopoverMenu,
	PopoverMenuItem,
	TextInput,
	VipBadge,
} from '@/components/ui'
import { Icon } from '@/icons'
import { LayoutPreview } from '../../components/layout-preview'
import type { WidgetSlotView } from '../../types'
import { SLOT_NAME_MAX_LENGTH } from '../../utils/slots/slot-access'

export type SlotStart = 'empty' | 'presets'

interface SlotCardProps {
	slot: WidgetSlotView
	disabled: boolean
	onSwitch: () => void
	onStart: (start: SlotStart) => void
	onRename: (name: string) => void
	onRequestClear: () => void
	onUpgrade: () => void
}

export function SlotCard({
	slot,
	disabled,
	onSwitch,
	onStart,
	onRename,
	onRequestClear,
	onUpgrade,
}: SlotCardProps) {
	const menuButtonRef = useRef<HTMLButtonElement>(null)
	const nameInputRef = useRef<HTMLInputElement>(null)
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isRenaming, setIsRenaming] = useState(false)
	const [draftName, setDraftName] = useState('')

	const isFresh = slot.isEmpty && !slot.isActive && !slot.isLocked
	const canManage = !slot.isLocked && (slot.isActive || !slot.isEmpty)

	useEffect(() => {
		if (isRenaming) nameInputRef.current?.select()
	}, [isRenaming])

	const startRenaming = () => {
		setIsMenuOpen(false)
		setDraftName(slot.customName ?? '')
		setIsRenaming(true)
	}

	const finishRenaming = (save: boolean) => {
		if (!isRenaming) return
		setIsRenaming(false)
		if (save && draftName.trim() !== (slot.customName ?? '')) onRename(draftName)
	}

	return (
		<article
			className={cn(
				'group flex flex-col w-full gap-3 p-3.5 text-right border rounded-2xl bg-fill shadow-sm transition-ui',
				slot.isActive
					? 'border-brand'
					: slot.isLocked
						? 'border-vip-fill-2'
						: 'border-line hover:border-brand-muted hover:shadow-md'
			)}
		>
			{isFresh ? (
				<div className="grid h-28 place-items-center rounded-xl border border-dashed border-line text-fg-faint group-hover:border-brand-muted group-hover:text-brand transition-ui">
					<Icon name="plus" size={20} aria-hidden="true" />
				</div>
			) : slot.isLocked && slot.isEmpty ? (
				<div className="grid h-28 place-items-center rounded-xl border border-line bg-fill-2 text-vip">
					<Icon name="lock" size={20} aria-hidden="true" />
				</div>
			) : (
				<LayoutPreview
					widgets={slot.widgets}
					wallpaper={slot.wallpaper}
					className={cn('h-28', slot.isLocked && 'opacity-60')}
				/>
			)}

			<div className="flex items-center justify-between gap-2 min-h-7">
				{isRenaming ? (
					<TextInput
						ref={nameInputRef}
						value={draftName}
						onChange={setDraftName}
						onBlur={() => finishRenaming(true)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') finishRenaming(true)
							if (e.key === 'Escape') {
								e.stopPropagation()
								finishRenaming(false)
							}
						}}
						placeholder={slot.label}
						maxLength={SLOT_NAME_MAX_LENGTH}
						size="sm"
						aria-label={t('widgets.slots.nameAria')}
					/>
				) : (
					<h4 className="text-sm font-bold truncate text-fg">{slot.label}</h4>
				)}

				{!isRenaming && (
					<div className="flex items-center gap-1 shrink-0">
						{slot.isActive && (
							<span className="rounded-full border border-brand-muted bg-brand-fill px-2 py-0.5 text-4xs font-bold text-brand">
								{t('widgets.slots.active')}
							</span>
						)}
						{slot.isLocked && (
							<VipBadge size="xs" variant="subtle" text={t('ui.vip.pro')} />
						)}
						{canManage && (
							<button
								ref={menuButtonRef}
								type="button"
								aria-label={t('widgets.slots.optionsAria', {
									name: slot.label,
								})}
								aria-haspopup="menu"
								aria-expanded={isMenuOpen}
								onClick={() => setIsMenuOpen((open) => !open)}
								className="grid rounded-lg cursor-pointer size-7 place-items-center text-fg-muted hover:bg-fill-2 hover:text-fg transition-ui focus-visible:focus-ring"
							>
								<Icon name="menuOption" size={16} aria-hidden="true" />
							</button>
						)}
					</div>
				)}
			</div>

			<p className="text-2xs leading-relaxed text-fg-muted min-h-8">
				{slot.isLocked
					? slot.isEmpty
						? t('widgets.slots.lockedHint')
						: t('widgets.slots.keptForPro')
					: isFresh
						? t('widgets.slots.freshHint')
						: t('widgets.slots.widgetCount', {
								count: slot.widgets.length.toLocaleString('fa-IR'),
							})}
			</p>

			<div className="flex flex-col gap-1.5 pt-3 mt-auto border-t border-line">
				{slot.isLocked ? (
					<Button
						onClick={onUpgrade}
						fullWidth
						size="sm"
						rounded="xl"
						variant="outline"
						color="vip"
						className="font-bold"
						icon={<Icon name="diamond" size={12} />}
					>
						{slot.isEmpty
							? t('widgets.slots.upgrade')
							: t('widgets.slots.renew')}
					</Button>
				) : isFresh ? (
					<div className="grid grid-cols-2 gap-1.5">
						<Button
							onClick={() => onStart('empty')}
							disabled={disabled}
							size="sm"
							rounded="xl"
							color="brand"
							className="font-bold"
							icon={<Icon name="plus" size={12} />}
						>
							{t('widgets.slots.create')}
						</Button>
						<Button
							onClick={() => onStart('presets')}
							disabled={disabled}
							size="sm"
							rounded="xl"
							variant="outline"
						>
							{t('widgets.slots.fromPresets')}
						</Button>
					</div>
				) : slot.isActive ? (
					<Button disabled fullWidth size="sm" rounded="xl" variant="ghost">
						{t('widgets.slots.youAreHere')}
					</Button>
				) : (
					<Button
						onClick={onSwitch}
						disabled={disabled}
						fullWidth
						size="sm"
						rounded="xl"
						color="brand"
						className="font-bold"
					>
						{t('widgets.slots.switch')}
					</Button>
				)}
			</div>

			<PopoverMenu
				isOpen={isMenuOpen}
				onClose={() => setIsMenuOpen(false)}
				triggerRef={menuButtonRef}
				placement="bottom-end"
				width={176}
			>
				<PopoverMenuItem
					icon={<Icon name="pen" size={14} />}
					label={t('widgets.slots.rename')}
					onClick={startRenaming}
				/>
				{!slot.isActive && (
					<PopoverMenuItem
						icon={<Icon name="trash" size={14} />}
						label={t('widgets.slots.clear')}
						variant="danger"
						onClick={() => {
							setIsMenuOpen(false)
							onRequestClear()
						}}
					/>
				)}
			</PopoverMenu>
		</article>
	)
}
