import type React from 'react'
import { useState } from 'react'
import { UI } from '@/context/appearance.context'
import { Icon } from '@/src/icons'
import { cn } from '@/common/utils/cn'
import { Button } from '../ui/button/button'
import { WidgetHelpModal } from '@/layouts/widgets-manager'

export interface UIOption {
	id: UI
	title: string
	badge?: string
	iconName: 'advanced_ui' | 'simple_ui' | 'platforms'
	description: string
	preview: React.ReactNode
}

export interface UIModeGroup {
	key: string
	title: string
	options: UIOption[]
}

export const UI_MODE_GROUPS: UIModeGroup[] = [
	{
		key: 'preset',
		title: 'آماده',
		options: [
			{
				id: UI.DEFAULT,
				title: 'کلاسیک',
				iconName: 'advanced_ui',
				description: 'چیدمان استاندارد و کامل با دسترسی راحت به ویجت‌ها',
				preview: (
					<div className="flex flex-col gap-1 w-full h-14 p-1.5 rounded-lg bg-base-300/40 border border-base-content/10">
						<div className="w-2/3 h-2 rounded bg-base-content/25 mx-auto" />
						<div className="grid grid-cols-3 gap-1 flex-1 mt-0.5">
							<div className="rounded bg-base-content/15 flex flex-col gap-0.5 p-0.5">
								<div className="h-1.5 w-full rounded-xs bg-base-content/25" />
								<div className="h-full rounded-xs bg-base-content/10" />
							</div>
							<div className="rounded bg-base-content/15 flex flex-col gap-0.5 p-0.5">
								<div className="h-1.5 w-full rounded-xs bg-base-content/25" />
								<div className="h-full rounded-xs bg-base-content/10" />
							</div>
							<div className="rounded bg-base-content/15 flex flex-col gap-0.5 p-0.5">
								<div className="h-1.5 w-full rounded-xs bg-base-content/25" />
								<div className="h-full rounded-xs bg-base-content/10" />
							</div>
						</div>
					</div>
				),
			},
			{
				id: UI.SIMPLE,
				title: 'ساده',
				iconName: 'simple_ui',
				description: 'صفحه خلوت و مرتب برای استفاده راحت و سریع',
				preview: (
					<div className="flex flex-col items-center justify-between w-full h-14 p-1.5 rounded-lg bg-base-300/40 border border-base-content/10">
						<div className="w-3/4 h-2.5 rounded bg-base-content/25" />
						<div className="grid grid-cols-3 gap-1 w-full mt-1 flex-1 items-end">
							<div className="h-4 rounded bg-base-content/15" />
							<div className="h-5 rounded bg-base-content/20" />
							<div className="h-4 rounded bg-base-content/15" />
						</div>
					</div>
				),
			},
		],
	},
	{
		key: 'custom',
		title: 'سفارشی',
		options: [
			{
				id: UI.CUSTOM,
				title: 'سفارشی',
				badge: 'پیشنهادی',
				iconName: 'platforms',
				description: 'چیدمان دلخواه با آزادی کامل در جابه‌جایی و تنظیم ویجت‌ها',
				preview: (
					<div className="flex flex-col gap-1 w-full h-14 p-1.5 rounded-lg bg-base-300/40 border border-base-content/10">
						<div className="grid grid-cols-4 gap-0.5 h-3">
							<div className="col-span-1 rounded-xs bg-base-content/20" />
							<div className="col-span-2 rounded-xs bg-primary/40" />
							<div className="col-span-1 rounded-xs bg-base-content/20" />
						</div>
						<div className="grid grid-cols-4 gap-0.5 flex-1">
							<div className="col-span-2 rounded-xs bg-base-content/25" />
							<div className="col-span-1 rounded-xs bg-base-content/15" />
							<div className="col-span-1 rounded-xs bg-base-content/20" />
						</div>
					</div>
				),
			},
		],
	},
]

export const UI_MODE_OPTIONS: UIOption[] = UI_MODE_GROUPS.flatMap(
	(group) => group.options
)

interface UIModeSelectorProps {
	value: UI
	onChange: (ui: UI) => void
	variant?: 'grid' | 'list'
	showPreview?: boolean
	className?: string
}

export function UIModeSelector({
	value,
	onChange,
	variant = 'grid',
	showPreview = true,
	className,
}: UIModeSelectorProps) {
	const currentUI =
		value === UI.DEFAULT || (value as string) === 'ADVANCED' ? UI.DEFAULT : value
	const [showGuideModal, setShowGuideModal] = useState(false)
	const isList = variant === 'list'

	return (
		<div className={cn('space-y-6', className)}>
			{UI_MODE_GROUPS.map((group) => (
				<div key={group.key} className="space-y-2.5">
					<span className="text-xs font-bold text-content/85 px-1 block">
						{group.title}
					</span>

					<div
						className={cn(
							'grid grid-cols-1 gap-3',
							group.options.length > 1
								? 'sm:grid-cols-2'
								: 'sm:grid-cols-1',
							isList && group.options.length > 1 && 'grid-cols-2!'
						)}
					>
						{group.options.map((opt) => {
							const isSelected = currentUI === opt.id
							const isCustom = opt.id === UI.CUSTOM

							if (isList || isCustom) {
								return (
									<button
										key={opt.id}
										type="button"
										onClick={() => onChange(opt.id)}
										className={cn(
											'relative min-w-0 w-full overflow-hidden rounded-2xl border p-3 text-right outline-none transition-all cursor-pointer group',
											isSelected
												? 'border-primary bg-primary/10 shadow-xs ring-1 ring-primary'
												: 'border-base-content/10 bg-base-300/20 hover:border-primary/40 hover:bg-base-300/40'
										)}
									>
										{isCustom ? (
											<div className="flex min-h-18 items-center gap-4">
												{showPreview && (
													<div className="w-[32%] sm:w-[28%] shrink-0">
														{opt.preview}
													</div>
												)}

												<div className="min-w-0 flex-1 relative">
													<div className="mb-1.5 flex items-center justify-between gap-2">
														<div className="flex items-center gap-1.5">
															<div
																className={cn(
																	'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border',
																	isSelected
																		? 'border-primary bg-primary text-white'
																		: 'border-base-content/30 bg-base-300/60'
																)}
															>
																{isSelected && (
																	<Icon
																		name="check"
																		size={10}
																	/>
																)}
															</div>

															<Icon
																name={opt.iconName}
																size={14}
																className={cn(
																	isSelected
																		? 'text-primary'
																		: 'text-muted'
																)}
															/>

															<span className="text-sm font-bold text-content">
																{opt.title}
															</span>

															{opt.badge && (
																<span className="px-1.5 py-0.2 text-[10px] font-bold rounded-md bg-primary/15 text-primary">
																	{opt.badge}
																</span>
															)}
														</div>

														<Button
															type="button"
															variant="default"
															size="xs"
															rounded="xl"
															onClick={(e) => {
																e.stopPropagation()
																setShowGuideModal(true)
															}}
															className="flex items-center gap-1 text-[11px] text-muted hover:text-content border border-base-content/10 shadow-none font-normal cursor-pointer py-0.5 px-2"
															title="راهنمای مدیریت ویجت‌ها"
														>
															<Icon name="help" size={11} />
															<span>راهنما</span>
														</Button>
													</div>

													<p className="text-[11px] text-muted leading-relaxed">
														{opt.description}
													</p>
												</div>
											</div>
										) : (
											<div className="flex flex-col">
												{showPreview && (
													<div className="mb-2.5 h-[44px] w-full overflow-hidden">
														{opt.preview}
													</div>
												)}

												<div className="mb-1.5 flex items-center gap-1.5">
													<div
														className={cn(
															'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border',
															isSelected
																? 'border-primary bg-primary text-white'
																: 'border-base-content/30 bg-base-300/60'
														)}
													>
														{isSelected && (
															<Icon
																name="check"
																size={10}
															/>
														)}
													</div>

													<Icon
														name={opt.iconName}
														size={14}
														className={cn(
															isSelected
																? 'text-primary'
																: 'text-muted'
														)}
													/>

													<span className="truncate text-sm font-bold text-content">
														{opt.title}
													</span>

													{opt.badge && (
														<span className="px-1.5 py-0.2 text-[10px] font-bold rounded-md bg-primary/15 text-primary">
															{opt.badge}
														</span>
													)}
												</div>

												<p className="text-[11px] text-muted leading-relaxed">
													{opt.description}
												</p>
											</div>
										)}
									</button>
								)
							}

							return (
								<button
									key={opt.id}
									type="button"
									onClick={() => onChange(opt.id)}
									className={cn(
										'relative flex flex-col justify-between rounded-2xl border p-3.5 text-right outline-none transition-all cursor-pointer group text-content min-h-[135px]',
										isSelected
											? 'border-primary bg-primary/10 shadow-xs ring-1 ring-primary'
											: 'border-base-content/10 bg-base-300/20 hover:border-primary/40 hover:bg-base-300/40'
									)}
								>
									<div>
										{showPreview && (
											<div className="w-full mb-2.5 transition-transform duration-200 group-hover:scale-[1.01]">
												{opt.preview}
											</div>
										)}

										<div className="flex items-center gap-1.5 mb-1.5">
											<div
												className={cn(
													'w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors',
													isSelected
														? 'border-primary bg-primary text-white'
														: 'border-base-content/30 bg-base-300/60 group-hover:border-primary/50'
												)}
											>
												{isSelected && (
													<Icon name="check" size={10} />
												)}
											</div>

											<div className="flex items-center gap-1">
												<Icon
													name={opt.iconName}
													size={14}
													className={cn(
														isSelected
															? 'text-primary'
															: 'text-muted'
													)}
												/>

												<span className="text-sm font-bold">
													{opt.title}
												</span>
											</div>
										</div>

										<p className="text-[11px] text-muted leading-relaxed">
											{opt.description}
										</p>
									</div>
								</button>
							)
						})}
					</div>
				</div>
			))}

			<WidgetHelpModal
				isOpen={showGuideModal}
				onClose={() => setShowGuideModal(false)}
			/>
		</div>
	)
}
