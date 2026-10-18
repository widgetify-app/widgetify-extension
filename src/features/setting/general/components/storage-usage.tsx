import { useState } from 'react'
import { type MessageKey, t } from '@/common/i18n'
import { showToast } from '@/common/toast'
import { cn } from '@/common/utils/cn'
import {
	Badge,
	Button,
	ClickableTooltip,
	ConfirmationModal,
	SectionPanel,
	Spinner,
} from '@/components/ui'
import { Icon } from '@/icons'
import { useStorageUsage } from '../hooks/use-storage-usage'
import {
	type ByteUnit,
	formatBytes,
	type StorageCategoryId,
	type UsageCategory,
} from '../utils/storage-usage'

const CATEGORY_LOOK: Record<
	StorageCategoryId,
	{ label: MessageKey; hint: MessageKey; swatch: string }
> = {
	wallpaper: {
		label: 'setting.storage.wallpaperLabel',
		hint: 'setting.storage.wallpaperHint',
		swatch: 'bg-brand',
	},
	explorerImages: {
		label: 'setting.storage.explorerImagesLabel',
		hint: 'setting.storage.explorerImagesHint',
		swatch: 'bg-success',
	},
	onlineData: {
		label: 'setting.storage.onlineDataLabel',
		hint: 'setting.storage.onlineDataHint',
		swatch: 'bg-warning',
	},
	fontsAndIcons: {
		label: 'setting.storage.fontsAndIconsLabel',
		hint: 'setting.storage.fontsAndIconsHint',
		swatch: 'bg-info',
	},
	appFiles: {
		label: 'setting.storage.appFilesLabel',
		hint: 'setting.storage.appFilesHint',
		swatch: 'bg-fill-3',
	},
	leftovers: {
		label: 'setting.storage.leftoversLabel',
		hint: 'setting.storage.leftoversHint',
		swatch: 'bg-danger',
	},
	browserExtra: {
		label: 'setting.storage.browserExtraLabel',
		hint: 'setting.storage.browserExtraHint',
		swatch: 'bg-danger-fill-2',
	},
	yourData: {
		label: 'setting.storage.yourDataLabel',
		hint: 'setting.storage.yourDataHint',
		swatch: 'bg-secondary',
	},
}

const UNIT_LABEL: Record<ByteUnit, MessageKey> = {
	kb: 'setting.storage.unitKb',
	mb: 'setting.storage.unitMb',
	gb: 'setting.storage.unitGb',
}

function sizeText(bytes: number): string {
	const { amount, unit } = formatBytes(bytes)
	return t('setting.storage.size', {
		amount: amount.toLocaleString('fa-IR'),
		unit: t(UNIT_LABEL[unit]),
	})
}

function UsageBar({
	categories,
	total,
	onSelect,
}: {
	categories: UsageCategory[]
	total: number
	onSelect: (category: UsageCategory, element: HTMLButtonElement) => void
}) {
	return (
		<div className="flex w-full h-2.5 gap-0.5 overflow-hidden rounded-full bg-fill-2">
			{categories.map((category) => (
				<button
					key={category.id}
					type="button"
					aria-label={`${t(CATEGORY_LOOK[category.id].label)} ${sizeText(category.bytes)}`}
					onClick={(event) => onSelect(category, event.currentTarget)}
					className={cn(
						'h-full min-w-1.5 cursor-pointer',
						CATEGORY_LOOK[category.id].swatch
					)}
					style={{
						width: `${total > 0 ? (category.bytes / total) * 100 : 0}%`,
					}}
				/>
			))}
		</div>
	)
}

function CategoryDetails({ category }: { category: UsageCategory }) {
	const look = CATEGORY_LOOK[category.id]
	return (
		<div className="flex flex-col gap-1">
			<div className="flex items-center justify-between gap-3">
				<div className="flex items-center gap-2">
					<span className={cn('size-2 shrink-0 rounded-full', look.swatch)} />
					<p className="text-sm font-medium text-fg">{t(look.label)}</p>
				</div>
				<p className="text-sm text-fg-muted">{sizeText(category.bytes)}</p>
			</div>
			<p className="text-xs leading-relaxed text-fg-muted">{t(look.hint)}</p>
		</div>
	)
}

export function StorageUsage() {
	const { summary, failed, isClearing, clear } = useStorageUsage()
	const [confirmOpen, setConfirmOpen] = useState(false)
	const [selected, setSelected] = useState<{
		category: UsageCategory
		anchor: HTMLButtonElement
	} | null>(null)
	const [tooltipOpen, setTooltipOpen] = useState(false)

	const showDetails = (category: UsageCategory, anchor: HTMLButtonElement) => {
		setSelected({ category, anchor })
		setTooltipOpen(true)
	}

	const handleClear = async () => {
		try {
			const freed = await clear()
			showToast(t('setting.storage.cleared', { size: sizeText(freed) }), 'success')
		} catch {
			showToast(t('setting.storage.clearFailed'), 'error')
		} finally {
			setConfirmOpen(false)
			setSelected(null)
		}
	}

	return (
		<SectionPanel
			title={
				<div className="flex items-center">
					<p>{t('setting.storage.title')}</p>
					<Badge className="mr-2">{t('setting.general.newBadge')}</Badge>
				</div>
			}
			size="sm"
		>
			<div className="flex flex-col gap-3">
				<div className="flex items-center justify-between gap-3">
					{summary ? (
						<p className="text-lg font-bold text-fg">
							{sizeText(summary.total)}
						</p>
					) : failed ? (
						<p className="text-sm text-danger">
							{t('setting.storage.loadError')}
						</p>
					) : (
						<div className="flex items-center gap-2 text-sm text-fg-muted">
							<Spinner size="sm" />
							<span>{t('setting.storage.loading')}</span>
						</div>
					)}
					{summary && (
						<Button
							variant="soft"
							color="danger"
							size="sm"
							icon={<Icon name="trash" size={14} />}
							disabled={summary.clearableBytes === 0 || isClearing}
							onClick={() => setConfirmOpen(true)}
						>
							{t('setting.storage.clear')}
						</Button>
					)}
				</div>

				{summary && (
					<>
						<UsageBar
							categories={summary.categories}
							total={summary.total}
							onSelect={showDetails}
						/>

						<div className="flex items-center justify-between gap-2">
							<p className="text-sm text-fg-muted">
								{t('setting.storage.clearableNote', {
									size: sizeText(summary.clearableBytes),
								})}
							</p>
							<p className="text-xs text-fg-muted">
								{t('setting.storage.barHint')}
							</p>
						</div>

						{selected && (
							<ClickableTooltip
								triggerRef={{ current: selected.anchor }}
								content={<CategoryDetails category={selected.category} />}
								contentClassName="w-64 p-3"
								isOpen={tooltipOpen}
								setIsOpen={setTooltipOpen}
							/>
						)}
					</>
				)}
			</div>

			<ConfirmationModal
				isOpen={confirmOpen}
				onClose={() => setConfirmOpen(false)}
				onConfirm={handleClear}
				variant="danger"
				isLoading={isClearing}
				title={t('setting.storage.confirmTitle')}
				message={t('setting.storage.confirmBody')}
				confirmText={t('setting.storage.confirm')}
				cancelText={t('setting.storage.cancel')}
			/>
		</SectionPanel>
	)
}
