import { Chip, VipBadge } from '@/components/ui'
import { cn } from '@/common/utils/cn'
import type {
	WidgetDefinition,
	WidgetSize,
	WidgetVariantOption,
} from '@/layouts/widgets/layout-engine/types'

interface AddWidgetOptionsProps {
	definition: WidgetDefinition
	selectedSize: WidgetSize
	selectedVariant: WidgetVariantOption | null
	isVip?: boolean
	onSelectSize: (size: WidgetSize) => void
	onSelectVariant: (variant: WidgetVariantOption) => void
	isVariantVipOnly: (widgetKey: string, variantId?: string) => boolean
	isSizeVipOnly: (widgetKey: string, size?: WidgetSize) => boolean
}

export function AddWidgetOptions({
	definition,
	selectedSize,
	selectedVariant,
	isVip = false,
	onSelectSize,
	onSelectVariant,
	isVariantVipOnly,
	isSizeVipOnly,
}: AddWidgetOptionsProps) {
	if (definition.variants && definition.variants.length > 0) {
		return (
			<div className="flex flex-col gap-1.5">
				<span className="text-xs font-bold text-content">
					انتخاب مدل و استایل:
				</span>
				<div className="flex flex-wrap gap-1.5">
					{definition.variants.map((variant) => {
						const isCurrent =
							selectedVariant?.id === variant.id ||
							(!selectedVariant &&
								selectedSize.w === variant.size.w &&
								selectedSize.h === variant.size.h)
						const isVipBadge =
							!isVip && isVariantVipOnly(definition.id, variant.id)

						return (
							<button
								key={variant.id}
								type="button"
								onClick={() => onSelectVariant(variant)}
								className={cn(
									'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all duration-150 cursor-pointer font-medium',
									isCurrent
										? 'bg-primary text-white font-bold shadow-xs'
										: 'bg-base-200/80 hover:bg-base-300 text-content border border-base-content/10'
								)}
							>
								<span>{variant.label}</span>
								{isVipBadge && (
									<VipBadge
										size="xs"
										variant={isCurrent ? 'white' : 'indigo-subtle'}
									/>
								)}
							</button>
						)
					})}
				</div>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-1.5">
			<span className="text-xs font-bold text-content">انتخاب اندازه ویجت:</span>
			<div className="flex flex-wrap gap-1.5">
				{definition.allowedSizes.map((sizeOption) => {
					const isCurrentSize =
						selectedSize.w === sizeOption.w && selectedSize.h === sizeOption.h
					const isDefault =
						definition.defaultSize.w === sizeOption.w &&
						definition.defaultSize.h === sizeOption.h
					const isVipBadge = !isVip && isSizeVipOnly(definition.id, sizeOption)

					return (
						<Chip
							onClick={() => onSelectSize(sizeOption)}
							key={`${sizeOption.w}x${sizeOption.h}`}
							className={cn(
								'py-1 flex items-center gap-1',
								isVipBadge && !isCurrentSize && 'border-indigo-500/30'
							)}
							selected={isCurrentSize}
						>
							<span>
								{sizeOption.w} × {sizeOption.h}
							</span>
							{isVipBadge && (
								<VipBadge
									size="xs"
									variant={isCurrentSize ? 'white' : 'indigo-subtle'}
								/>
							)}
							{isDefault && !isCurrentSize && !isVipBadge && (
								<span className="text-[9px] text-muted mr-1">
									(پیش‌فرض)
								</span>
							)}
						</Chip>
					)
				})}
			</div>
		</div>
	)
}
