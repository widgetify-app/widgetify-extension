import { ConfigKey } from '@/common/constants/config-keys'
import { SectionPanel, Spinner } from '@/components/ui'
import type { Task } from '@/services/user/referrals-service.hook'
import { Icon } from '@/icons'

interface Prop {
	tasks: Task[]
	isLoading: boolean
}

export function RewardTasks({ tasks, isLoading }: Prop) {
	return (
		<SectionPanel title={'ماموریت‌ها'} size="sm">
			<div className="flex flex-col gap-2 py-2">
				{isLoading ? (
					<div className="py-12 text-center">
						<Spinner size="xl" className="mx-auto" />
						<p className="mt-4 text-sm text-fg-muted">یه لحظه…</p>
					</div>
				) : tasks.length > 0 ? (
					tasks.map((taskItem, index) => {
						return (
							<div
								key={index}
								className={`relative overflow-hidden rounded-2xl transition-ui duration-300 ${
									taskItem.isDone
										? 'bg-gradient-to-r from-success-fill to-success-fill border border-success-fill-2'
										: 'bg-gradient-to-r from-surface to-surface-2 border border-surface-3'
								}`}
							>
								<div className="relative flex items-center justify-between gap-3 p-3">
									<div className="flex items-center flex-1 gap-3">
										<div
											className={`relative flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-ui duration-300 ${
												taskItem.isDone
													? 'bg-gradient-to-br from-success to-success shadow-md shadow-success-fill-2'
													: 'bg-gradient-to-br from-brand to-brand shadow-sm shadow-brand-fill-2'
											}`}
										>
											{taskItem.isDone ? (
												<div className="relative">
													<Icon
														name="check"
														className="w-5 h-5 text-on-success drop-shadow-lg"
													/>
													<div className="absolute inset-0 rounded-full bg-image-fill animate-ping"></div>
												</div>
											) : (
												<Icon
													name="target"
													className="w-5 h-5 text-on-brand"
												/>
											)}
										</div>
										<div className="flex-1 min-w-0">
											<p
												className={`text-sm font-medium transition-ui duration-200 ${
													taskItem.isDone
														? 'text-success line-through'
														: 'text-fg-strong'
												}`}
											>
												{taskItem.task}
											</p>
											{taskItem.button && !taskItem.isDone && (
												<div className="mt-2">
													{taskItem.button.type === 'link' && (
														<a
															href={taskItem.button.url}
															target="_blank"
															rel="noopener noreferrer"
															className="inline-flex items-center px-3 py-1 text-xs font-medium transition-ui duration-200 rounded-lg bg-brand-fill text-brand hover:bg-brand-fill-2"
														>
															<Icon
																name="externalLink"
																className="w-3.5 h-3.5 ml-2"
															/>
															{taskItem.button.label}
														</a>
													)}
												</div>
											)}
										</div>
									</div>
									<div
										className={`flex items-center flex-shrink-0 gap-1.5 px-2.5 py-1 rounded-lg ${
											taskItem.isDone
												? 'bg-success-fill'
												: 'bg-brand-fill'
										}`}
									>
										<span
											className={`text-sm font-bold ${
												taskItem.isDone
													? 'text-success'
													: 'text-brand'
											}`}
										>
											+{taskItem.reward_coin}
										</span>
										<img
											src={ConfigKey.WIG_COIN_ICON}
											alt="ویج‌کوین"
											className="w-6 h-6"
										/>
									</div>
								</div>
							</div>
						)
					})
				) : (
					<div className="py-12 text-center">
						<div className="relative flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-surface-2 to-surface-3">
							<Icon name="check" className="w-8 h-8 text-fg-muted" />
							<div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent to-fill"></div>
						</div>
						<p className="text-sm font-medium text-fg-muted">
							فعلاً ماموریتی نیست
						</p>
						<p className="mt-1 text-xs text-fg-faint">
							به‌زودی ماموریت‌های تازه میان
						</p>
					</div>
				)}
			</div>
		</SectionPanel>
	)
}
