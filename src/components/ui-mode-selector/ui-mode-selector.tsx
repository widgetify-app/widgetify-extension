import React from 'react'
import { UI } from '@/context/appearance.context'
import { Icon } from '@/src/icons'
import { cn } from '@/common/utils/cn'

export interface UIOption {
	id: UI
	title: string
	badge?: string
	iconName: 'advanced_ui' | 'simple_ui' | 'platforms'
	description: string
	preview: React.ReactNode
}

export const UI_MODE_OPTIONS: UIOption[] = [
	{
		id: UI.DEFAULT,
		title: 'کلاسیک',
		iconName: 'advanced_ui',
		description: 'چیدمان منظم و یکپارچه در ۳ ستون',
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
		title: 'ساده و خلوت',
		badge: 'مینیمال',
		iconName: 'simple_ui',
		description: 'ساده و خلوت، برای جستجو و دسترسی سریع',
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
	{
		id: UI.CUSTOM,
		title: 'شخصی‌سازی',
		badge: 'بوم آزاد',
		iconName: 'platforms',
		description: 'ویجت‌ها رو جابه‌جا کن و چیدمان رو خودت بچین',
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
]

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

	const isList = variant === 'list'

	return (
		<div
			className={cn(
				'grid grid-cols-1 gap-3 sm:grid-cols-3',
				isList && 'grid-cols-2!',
				className
			)}
		>
			{UI_MODE_OPTIONS.map((opt, index) => {
				const isSelected = currentUI === opt.id
				const isLast = index === UI_MODE_OPTIONS.length - 1

				if (isList) {
					return (
						<button
							key={opt.id}
							type="button"
							onClick={() => onChange(opt.id)}
							className={cn(
								'relative min-w-0 w-full overflow-hidden rounded-2xl border p-2 text-right outline-none transition-all cursor-pointer group',

								isSelected
									? 'border-primary bg-primary/10 shadow-sm'
									: 'border-content bg-base-300/20 hover:border-primary/40 hover:bg-base-300/40',

								isLast && 'col-span-2'
							)}
						>
							{opt.badge && (
								<span
									className={cn(
										'absolute left-2.5 top-2.5 z-10 rounded-md px-1.5 py-0.5 text-[10px] font-medium',
										isSelected
											? 'bg-primary text-white'
											: 'bg-base-300 text-muted'
									)}
								>
									{opt.badge}
								</span>
							)}

							{isLast ? (
								<div className="flex min-h-[92px] items-center gap-4">
									{showPreview && (
										<div className="w-[42%] shrink-0">
											{opt.preview}
										</div>
									)}

									<div className="min-w-0 flex-1">
										{/* Title */}
										<div className="mb-1.5 flex items-center gap-2">
											<div
												className={cn(
													'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border',
													isSelected
														? 'border-primary bg-primary text-white'
														: 'border-content bg-base-300/60'
												)}
											>
												{isSelected && (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-2.5 w-2.5"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
														strokeWidth={3.5}
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M5 13l4 4L19 7"
														/>
													</svg>
												)}
											</div>

											<div className="flex items-center gap-1.5">
												<Icon
													name={opt.iconName}
													size={15}
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

										<p className="text-[11px] leading-relaxed text-muted">
											{opt.description}
										</p>
									</div>
								</div>
							) : (
								<div className="flex flex-col">
									{showPreview && (
										<div className="mb-2 h-[48px] w-full overflow-hidden">
											{opt.preview}
										</div>
									)}

									<div className="mb-1 flex items-center gap-2">
										<div
											className={cn(
												'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border',
												isSelected
													? 'border-primary bg-primary text-white'
													: 'border-content bg-base-300/60'
											)}
										>
											{isSelected && (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-2.5 w-2.5"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													strokeWidth={3.5}
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M5 13l4 4L19 7"
													/>
												</svg>
											)}
										</div>

										<Icon
											name={opt.iconName}
											size={15}
											className={cn(
												isSelected ? 'text-primary' : 'text-muted'
											)}
										/>

										<span className="truncate text-sm font-bold">
											{opt.title}
										</span>
									</div>

									<p className="text-[11px] leading-relaxed text-muted">
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
							'relative flex flex-col rounded-2xl border p-3 text-right outline-none transition-all cursor-pointer group text-content',

							isSelected
								? 'border-primary bg-primary/10 shadow-sm'
								: 'border-content bg-base-300/20 hover:border-primary/40 hover:bg-base-300/40'
						)}
					>
						{showPreview && (
							<div className="w-full mb-2.5 transition-transform duration-200 group-hover:scale-[1.02]">
								{opt.preview}
							</div>
						)}

						<div className="flex items-center gap-2 mb-1">
							<div
								className={cn(
									'w-4 h-4 rounded-full border flex items-center justify-center shrink-0',
									isSelected
										? 'border-primary bg-primary text-white'
										: 'border-content bg-base-300/60'
								)}
							>
								{isSelected && (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="w-2.5 h-2.5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={3.5}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M5 13l4 4L19 7"
										/>
									</svg>
								)}
							</div>

							<div className="flex items-center gap-1.5">
								<Icon
									name={opt.iconName}
									size={15}
									className={cn(
										isSelected ? 'text-primary' : 'text-muted'
									)}
								/>

								<span className="text-sm font-bold">{opt.title}</span>
							</div>
						</div>

						<p className="text-[11px] text-muted leading-relaxed mt-0.5">
							{opt.description}
						</p>
					</button>
				)
			})}
		</div>
	)
}
