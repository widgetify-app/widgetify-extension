import { type ReactNode, type Ref, useId } from 'react'
import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { Button, EmptyState } from '@/components/ui'
import type { PlanOffer } from '../../utils/plan-offers'
import { SectionHeading } from '../section-heading'
import { PlanCard } from './plan-card'

const COLUMNS: Record<number, string> = {
	1: '@2xl:grid-cols-1 @2xl:max-w-sm',
	2: '@2xl:grid-cols-2',
	4: '@2xl:grid-cols-2',
}

interface PlanSectionProps {
	ref?: Ref<HTMLElement>
	title: string
	description: string
	offers: PlanOffer[]
	selectedId: string | null
	isLoading: boolean
	isError: boolean
	onRetry: () => void
	onSelect: (offer: PlanOffer) => void
	footnote: (offer: PlanOffer) => string
	children?: ReactNode
}

export function PlanSection({
	ref,
	title,
	description,
	offers,
	selectedId,
	isLoading,
	isError,
	onRetry,
	onSelect,
	footnote,
	children,
}: PlanSectionProps) {
	const titleId = useId()

	return (
		<section
			ref={ref}
			aria-labelledby={titleId}
			className="flex flex-col scroll-mt-4"
		>
			<SectionHeading id={titleId} title={title} description={description} />

			{isLoading ? (
				<div className="grid mt-10 gap-x-3.5 gap-y-6 @2xl:grid-cols-3">
					{[0, 1, 2].map((index) => (
						<div
							key={index}
							className="p-5 space-y-3 border-2 rounded-2xl min-h-45 bg-surface-2 border-surface-3"
						>
							<div className="w-1/2 h-5 rounded-lg skeleton" />
							<div className="w-3/4 h-8 rounded-lg skeleton" />
							<div className="w-full h-4 rounded-lg skeleton" />
						</div>
					))}
				</div>
			) : isError ? (
				<EmptyState
					icon="alert"
					title={t('setting.vip.plansFailed')}
					action={
						<Button size="sm" onClick={onRetry}>
							{t('setting.vip.retry')}
						</Button>
					}
				/>
			) : offers.length === 0 ? (
				<EmptyState icon="diamond" title={t('setting.vip.emptyPlans')} />
			) : (
				<div
					className={cn(
						'grid mt-10 gap-x-3.5 gap-y-6',
						COLUMNS[offers.length] ?? '@2xl:grid-cols-3'
					)}
				>
					{offers.map((offer) => (
						<PlanCard
							key={offer.plan.id}
							offer={offer}
							isSelected={offer.plan.id === selectedId}
							footnote={footnote(offer)}
							onSelect={() => onSelect(offer)}
						/>
					))}
				</div>
			)}

			{children && <div className="flex flex-col gap-3 mt-3.5">{children}</div>}
		</section>
	)
}
