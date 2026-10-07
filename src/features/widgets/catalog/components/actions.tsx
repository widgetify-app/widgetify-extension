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
			<span>حذف از صفحه</span>
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
						? 'ارتقا به پرو برای ذخیره این مدل'
						: 'ارتقا به پرو برای فعال‌سازی'
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
				<span>ذخیره تغییرات</span>
			</Button>
		)
	}

	if (isCurrentlyActive && (isLimitReached || isDuplicateRestricted)) {
		return (
			<div className="flex flex-col w-full gap-2">
				<ProUpgradeButton
					label={
						isDuplicateRestricted
							? 'تکرار ویجت مخصوص کاربران پرو'
							: 'تکمیل ظرفیت ویجت‌ها (ارتقا برای نامحدود)'
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
				label="تکمیل ظرفیت ویجت‌ها (ارتقا برای نامحدود)"
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
					افزودن ویجت با اندازه {selectedSize.w}×{selectedSize.h}
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
			<span>افزودن به صفحه</span>
		</Button>
	)
}
