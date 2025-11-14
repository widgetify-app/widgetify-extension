import { BiLinkExternal } from 'react-icons/bi'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { FiBookmark, FiCheck, FiStar, FiTarget, FiUser, FiUserPlus } from 'react-icons/fi'
import { ConfigKey } from '@/common/constant/config.key'
import { SectionPanel } from '@/components/section-panel'
import type { Task } from '@/services/hooks/user/referralsService.hook'

interface Prop {
	tasks: Task[]
	isLoading: boolean
}

const getTaskIcon = (iconName: string) => {
	const iconMap: Record<string, any> = {
		'user-plus': FiUserPlus,
		user: FiUser,
		bookmark: FiBookmark,
		star: FiStar,
		target: FiTarget,
	}

	return iconMap[iconName] || FiTarget
}

export function RewardTasks({ tasks, isLoading }: Prop) {
	return (
		<SectionPanel title={'ماموریت‌ها'} size="xs">
			<div className="flex flex-col gap-2 py-2">
				{isLoading ? (
					<div className="py-12 text-center">
						<div className="w-8 h-8 mx-auto border-4 rounded-full border-primary/30 border-t-primary animate-spin"></div>
						<p className="mt-4 text-sm text-muted">در حال بارگذاری...</p>
					</div>
				) : tasks.length > 0 ? (
					tasks.map((taskItem, index) => {
						const IconComponent = getTaskIcon(taskItem.icon)
						return (
							<div
								key={index}
								className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
									taskItem.isDone
										? 'bg-gradient-to-r from-success/5 to-success/10 border border-success/20'
										: 'bg-gradient-to-r from-base-100 to-base-200 border border-base-300'
								}`}
							>
								<div className="relative flex items-center justify-between gap-3 p-3">
									<div className="flex items-center flex-1 gap-3">
										<div
											className={`relative flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
												taskItem.isDone
													? 'bg-gradient-to-br from-success to-success/80 shadow-md shadow-success/20'
													: 'bg-gradient-to-br from-primary to-primary/80 shadow-sm shadow-primary/20'
											}`}
										>
											{taskItem.isDone ? (
												<div className="relative">
													<FiCheck className="w-5 h-5 text-white drop-shadow-lg" />
													<div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
												</div>
											) : (
												<IconComponent className="w-5 h-5 text-white" />
											)}
										</div>
										<div className="flex-1 min-w-0">
											<p
												className={`text-sm font-medium transition-all duration-200 ${
													taskItem.isDone
														? 'text-success/80 line-through'
														: 'text-base-content'
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
															className="inline-flex items-center px-3 py-1 text-xs font-medium transition-all duration-200 rounded-lg bg-primary/10 text-primary hover:bg-primary/20"
														>
															<BiLinkExternal className="w-3.5 h-3.5 ml-2" />
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
												? 'bg-success/10'
												: 'bg-primary/10'
										}`}
									>
										<span
											className={`text-sm font-bold ${
												taskItem.isDone
													? 'text-success'
													: 'text-primary'
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
						<div className="relative flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-base-200 to-base-300">
							<FiCheck className="w-8 h-8 text-muted" />
							<div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent to-white/5"></div>
						</div>
						<p className="text-sm font-medium text-muted">
							هیچ ماموریتی یافت نشد
						</p>
						<p className="mt-1 text-xs text-muted/60">
							ماموریت‌های جدید به زودی اضافه می‌شوند
						</p>
					</div>
				)}
			</div>
		</SectionPanel>
	)
}
