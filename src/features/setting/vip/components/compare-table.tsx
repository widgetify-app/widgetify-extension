import { useId } from 'react'
import { type MessageKey, t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'
import { SectionHeading } from './section-heading'

type Cell = boolean | MessageKey

const ROWS: { label: MessageKey; free: Cell; pro: Cell }[] = [
	{ label: 'setting.vip.rowCoreWidgets', free: true, pro: true },
	{
		label: 'setting.vip.rowDuplicates',
		free: 'setting.vip.rowDuplicatesFree',
		pro: 'setting.vip.rowDuplicatesPro',
	},
	{
		label: 'setting.vip.rowVariants',
		free: 'setting.vip.rowVariantsFree',
		pro: 'setting.vip.rowVariantsPro',
	},
	{ label: 'setting.vip.videoTitle', free: false, pro: true },
	{ label: 'setting.vip.rowSync', free: false, pro: true },
	{
		label: 'setting.vip.rowGallery',
		free: 'setting.vip.rowGalleryFree',
		pro: 'setting.vip.rowGalleryPro',
	},
]

function CellMark({ value, isPro }: { value: Cell; isPro: boolean }) {
	if (typeof value === 'string') {
		return (
			<span
				className={cn(
					'text-xs',
					isPro ? 'font-extrabold text-vip' : 'font-semibold text-fg-muted'
				)}
			>
				{t(value)}
			</span>
		)
	}
	if (!value) {
		return (
			<span className="inline-block align-middle rounded-full w-3.5 h-0.75 bg-fg-ghost">
				<span className="sr-only">{t('setting.vip.notIncluded')}</span>
			</span>
		)
	}
	return (
		<span
			className={cn(
				'inline-grid rounded-full size-6 place-items-center align-middle',
				isPro ? 'bg-vip text-on-vip' : 'bg-fill-2 text-fg-muted'
			)}
		>
			<Icon name="check" size={12} strokeWidth={3} />
			<span className="sr-only">{t('setting.vip.included')}</span>
		</span>
	)
}

export function CompareTable() {
	const titleId = useId()

	return (
		<section aria-labelledby={titleId} className="flex flex-col gap-4">
			<SectionHeading
				id={titleId}
				title={t('setting.vip.compareTitle')}
				description={t('setting.vip.compareBody')}
			/>
			<div className="overflow-hidden border rounded-2xl bg-surface-2 border-surface-3">
				<table className="w-full text-sm table-fixed">
					<caption className="sr-only">{t('setting.vip.compareLabel')}</caption>
					<colgroup>
						<col />
						<col className="w-26 @2xl:w-40" />
						<col className="w-26 @2xl:w-40 bg-vip-fill" />
					</colgroup>
					<thead>
						<tr className="h-14">
							<th
								scope="col"
								className="text-xs font-bold ps-4 @lg:ps-5 text-start text-fg-muted"
							>
								{t('setting.vip.compareFeature')}
							</th>
							<th scope="col" className="text-sm font-extrabold text-fg">
								{t('setting.vip.freeLabel')}
							</th>
							<th scope="col">
								<span className="inline-flex items-center gap-1.5 px-3.5 text-xs font-extrabold rounded-full h-7.5 bg-vip text-on-vip">
									<Icon name="diamond" size={14} />
									{t('setting.vip.proLabel')}
								</span>
							</th>
						</tr>
					</thead>
					<tbody>
						{ROWS.map((row) => (
							<tr
								key={row.label}
								className="border-t h-13 border-surface-3"
							>
								<th
									scope="row"
									className="py-2 font-semibold leading-relaxed ps-4 @lg:ps-5 text-start text-fg"
								>
									{t(row.label)}
								</th>
								<td className="px-1 text-center">
									<CellMark value={row.free} isPro={false} />
								</td>
								<td className="px-1 text-center">
									<CellMark value={row.pro} isPro />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	)
}
