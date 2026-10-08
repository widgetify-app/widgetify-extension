import { t } from '@/common/i18n'
import { Button } from '@/components/ui'
import type { WidgetSize } from '@/features/widgets/utils/layout-engine/types'
import { Icon } from '@/icons'

interface AddWidgetActionsProps {
	isVipRequired: boolean
	isVip: boolean
	isEditMode: boolean
	isLimitReached: boolean
	canAddCustom: boolean
	isCurrentlyActive: boolean
	isDuplicateRestricted?: boolean
	selectedSize: WidgetSize
	isLoading?: boolean
	onSave: () => void
	onRemove: () => void
	onUpgrade: () => void
}

function ProUpgradeButton({
	label,
	onUpgrade,
}: {
	label: string
	onUpgrade: () => void
}) {
	return (
		<Button
			type="button"
			onClick={onUpgrade}
			className="w-full gap-2 font-bold"
			rounded={'2xl'}
			variant={'outline'}
			color={'vip'}
		>
			<Icon name="diamond" size={14} />
			<span>{label}</span>
		</Button>
	)
}

function RemoveFromPageButton({ onRemove }: { onRemove: () => void }) {
	return (
		<Button
			type="button"
			onClick={onRemove}
			className="w-full"
			rounded={'2xl'}
			variant={'outline'}
			color={'danger'}
		>
			<span>{t('widgets.catalog.removeFromPage')}</span>
		</Button>
	)
}

export function AddWidgetActions({
	isVipRequired,
	isVip,
	isEditMode,
	isLimitReached,
	canAddCustom,
	isCurrentlyActive,
	isDuplicateRestricted = false,
	selectedSize,
	isLoading = false,
	onSave,
	onRemove,
	onUpgrade,
}: AddWidgetActionsProps) {
	if (isVipRequired && !isVip) {
		return (
			<ProUpgradeButton
				label={
					isEditMode
						? t('widgets.catalog.upgradeToSave')
						: t('widgets.catalog.upgradeToEnable')
				}
				onUpgrade={onUpgrade}
			/>
		)
	}

	if (isEditMode) {
		return (
			<Button
				type="button"
				onClick={onSave}
				className="w-full"
				rounded={'2xl'}
				color={'brand'}
				loading={isLoading}
				disabled={isLoading}
			>
				<span>{t('widgets.catalog.saveChanges')}</span>
			</Button>
		)
	}

	if (isCurrentlyActive && (isLimitReached || isDuplicateRestricted)) {
		return (
			<div className="flex flex-col w-full gap-2">
				<ProUpgradeButton
					label={
						isDuplicateRestricted
							? t('widgets.catalog.duplicateProOnly')
							: t('widgets.catalog.limitReached')
					}
					onUpgrade={onUpgrade}
				/>
				<RemoveFromPageButton onRemove={onRemove} />
			</div>
		)
	}

	if (isLimitReached) {
		return (
			<ProUpgradeButton
				label={t('widgets.catalog.limitReached')}
				onUpgrade={onUpgrade}
			/>
		)
	}

	if (canAddCustom) {
		return (
			<Button
				type="button"
				onClick={onSave}
				className="w-full"
				rounded={'2xl'}
				color={'brand'}
				loading={isLoading}
				disabled={isLoading}
			>
				<span>+</span>
				<span>
					{t('widgets.catalog.addWithSize', {
						w: selectedSize.w,
						h: selectedSize.h,
					})}
				</span>
			</Button>
		)
	}

	if (isCurrentlyActive) {
		return <RemoveFromPageButton onRemove={onRemove} />
	}

	return (
		<Button
			type="button"
			onClick={onSave}
			className="w-full"
			rounded={'2xl'}
			color={'brand'}
			loading={isLoading}
			disabled={isLoading}
		>
			<span>+</span>
			<span>{t('widgets.catalog.addToPage')}</span>
		</Button>
	)
}
