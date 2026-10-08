import type { ReactNode } from 'react'
import { cn } from '@/common/utils/cn'
import { Button, EmptyArt, VipBadge } from '@/components/ui'
import { Icon, type IconName } from '@/icons'
import {
	WidgetCenteredHeader,
	WidgetHeader,
} from '@/features/widgets/components/widget-header'
import type { WidgetSize } from '../../utils/layout-engine/types'
import { PHOTO_PLACEHOLDER_SRC } from '../constants'

const WIDGET_TITLE = 'قاب عکس'
const FAILED_TITLE = 'عکس باز نشد'

interface PhotoEmptyStateProps {
	size: WidgetSize
	hasFailed: boolean
	isVip: boolean
	onPickFromDevice: () => void
	onOpenGallery: () => void
}

export function PhotoEmptyState({
	size,
	hasFailed,
	isVip,
	onPickFromDevice,
	onOpenGallery,
}: PhotoEmptyStateProps) {
	if (size.h === 1) {
		const isSquare = size.w === 1

		return (
			<>
				{isSquare ? (
					<WidgetCenteredHeader
						title={hasFailed ? FAILED_TITLE : WIDGET_TITLE}
					/>
				) : (
					<WidgetHeader
						title={WIDGET_TITLE}
						info={hasFailed ? FAILED_TITLE : undefined}
					/>
				)}
				<div className="grid flex-1 min-h-0 grid-cols-2 gap-1.5">
					<PhotoSourceButton
						icon="uploadImage"
						label="از دستگاه"
						isStacked={isSquare}
						badge={!isSquare && !isVip && <VipBadge size="xs" iconOnly />}
						onClick={onPickFromDevice}
					/>
					<PhotoSourceButton
						icon="image"
						label="گالری"
						isStacked={isSquare}
						onClick={onOpenGallery}
					/>
				</div>
			</>
		)
	}

	const showsPlaceholder = size.w === 2 && size.h === 2 && !hasFailed

	return (
		<>
			<WidgetHeader title={WIDGET_TITLE} />
			<div className="flex flex-col items-center justify-center flex-1 min-h-0 gap-1.5 text-center select-none">
				{showsPlaceholder ? (
					<img
						src={PHOTO_PLACEHOLDER_SRC}
						alt=""
						className="flex-1 object-cover w-full min-h-0 rounded-xl"
					/>
				) : (
					<>
						<EmptyArt
							name={hasFailed ? 'photoError' : 'photo'}
							className="mb-0.5 size-12"
						/>
						<p className="text-xs font-bold text-fg-strong">
							{hasFailed ? FAILED_TITLE : 'یه عکس بذار اینجا'}
						</p>
					</>
				)}
				{size.h > 2 && (
					<p className="leading-relaxed text-2xs text-fg-muted">
						{hasFailed
							? 'شاید پاک شده باشه، یکی دیگه انتخاب کن'
							: 'عکس خودت یا یکی از عکس‌های گالری'}
					</p>
				)}
				<div className="flex flex-wrap justify-center gap-1.5 mt-1">
					<Button
						size="xs"
						color="brand"
						rounded="lg"
						onClick={onPickFromDevice}
						icon={<Icon name="uploadImage" size={12} />}
					>
						از دستگاه
						{!isVip && <VipBadge size="xs" />}
					</Button>
					<Button
						size="xs"
						color="base"
						rounded="lg"
						onClick={onOpenGallery}
						icon={<Icon name="image" size={12} />}
					>
						گالری
					</Button>
				</div>
			</div>
		</>
	)
}

interface PhotoSourceButtonProps {
	icon: IconName
	label: string
	isStacked: boolean
	badge?: ReactNode
	onClick: () => void
}

function PhotoSourceButton({
	icon,
	label,
	isStacked,
	badge,
	onClick,
}: PhotoSourceButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				'flex items-center justify-center min-w-0 min-h-0 rounded-xl cursor-pointer select-none font-semibold bg-fill text-fg-muted transition-ui hover:bg-fill-2 hover:text-fg-strong focus-visible:focus-ring',
				isStacked ? 'flex-col gap-1 text-3xs' : 'gap-1.5 px-2 text-2xs'
			)}
		>
			<Icon name={icon} size={isStacked ? 16 : 14} aria-hidden="true" />
			<span className="max-w-full truncate">{label}</span>
			{badge}
		</button>
	)
}
