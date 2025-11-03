import { FiBookmark, FiCheck, FiStar, FiTarget, FiUser, FiUserPlus } from 'react-icons/fi'
import { SectionPanel } from '@/components/section-panel'
import { useGetReferrals } from '@/services/hooks/user/referralsService.hook'
import { ReferralCodeSection } from './components/ReferralCodeSection'

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

export const RewardsTab = () => {
	const { data, isLoading } = useGetReferrals()

	const code = data?.code || ''
	const tasks = data?.tasks || []

	return (
		<div className="space-y-4">
			<ReferralCodeSection code={code} />
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
													<FiCheck className="w-5 h-5 text-white" />
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
											<span className="text-xs font-medium text-muted">
												ویج‌کوین
											</span>
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
		</div>
	)
}
