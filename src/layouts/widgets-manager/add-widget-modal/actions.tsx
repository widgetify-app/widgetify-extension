import { Button } from '@/components/ui'
import { callEvent } from '@/common/utils/call-event'
import type { WidgetSize } from '@/layouts/widgets/layout-engine/types'
import { Icon } from '@/src/icons'

interface AddWidgetActionsProps {
	isVipRequired: boolean
	isVip: boolean
	isEditMode: boolean
	isLimitReached: boolean
	canAddCustom: boolean
	isCurrentlyActive: boolean
	isDuplicateRestricted?: boolean
	selectedSize: WidgetSize
	onSave: () => void
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
	onSave,
}: AddWidgetActionsProps) {
	if (isVipRequired && !isVip) {
		return (
			<Button
				type="button"
				onClick={() => callEvent('openSettings', 'vip')}
				className="flex items-center justify-center w-full gap-2 font-bold border bg-warning/15 hover:bg-warning/25 text-warning border-warning/30"
				rounded={'2xl'}
				variant={'default'}
			>
				<Icon name="crown" size={14} />
				<span>
					{isEditMode
						? 'ارتقا به پرو برای ذخیره این مدل'
						: 'ارتقا به پرو برای فعال‌سازی'}
				</span>
			</Button>
		)
	}

	if (isEditMode) {
		return (
			<Button
				type="button"
				onClick={onSave}
				className="w-full"
				rounded={'2xl'}
				variant={'primary'}
			>
				<span>ذخیره تغییرات</span>
			</Button>
		)
	}

	if (isLimitReached) {
		return (
			<Button
				type="button"
				onClick={() => callEvent('openSettings', 'vip')}
				className="flex items-center justify-center w-full gap-2 font-bold border bg-warning/15 hover:bg-warning/25 text-warning border-warning/30"
				rounded={'2xl'}
				variant={'default'}
			>
				<Icon name="crown" size={14} />
				<span>تکمیل ظرفیت ویجت‌ها (ارتقا برای نامحدود)</span>
			</Button>
		)
	}

	if (canAddCustom) {
		return (
			<Button
				type="button"
				onClick={onSave}
				className="w-full"
				rounded={'2xl'}
				variant={'primary'}
			>
				<span>+</span>
				<span>
					افزودن ویجت با اندازه {selectedSize.w}×{selectedSize.h}
				</span>
			</Button>
		)
	}

	if (!isVip && isCurrentlyActive && isDuplicateRestricted) {
		return (
			<Button
				type="button"
				onClick={() => callEvent('openSettings', 'vip')}
				className="flex items-center justify-center w-full gap-2 font-bold border bg-warning/15 hover:bg-warning/25 text-warning border-warning/30"
				rounded={'2xl'}
				variant={'default'}
			>
				<Icon name="crown" size={14} />
				<span>تکرار ویجت مخصوص کاربران پرو</span>
			</Button>
		)
	}

	if (isCurrentlyActive) {
		return (
			<Button
				type="button"
				onClick={onSave}
				className="w-full text-error hover:bg-error/10 border-error/20"
				rounded={'2xl'}
				variant={'default'}
			>
				<span>حذف از صفحه</span>
			</Button>
		)
	}

	if (isLimitReached) {
		return (
			<Button
				type="button"
				onClick={() => callEvent('openSettings', 'vip')}
				className="flex items-center justify-center w-full gap-2 font-bold border bg-warning/15 hover:bg-warning/25 text-warning border-warning/30"
				rounded={'2xl'}
				variant={'default'}
			>
				<Icon name="crown" size={14} />
				<span>حداکثر ویجت‌های مجاز (ارتقا برای نامحدود)</span>
			</Button>
		)
	}

	return (
		<Button
			type="button"
			onClick={onSave}
			className="w-full"
			rounded={'2xl'}
			variant={'primary'}
		>
			<span>+</span>
			<span>افزودن به صفحه</span>
		</Button>
	)
}
