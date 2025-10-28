import { FiGift } from 'react-icons/fi'
import { SectionPanel } from '@/components/section-panel'
import type { ReferralUser } from '@/services/hooks/user/referralsService.hook'
import { ReferralItem } from './ReferralItem'

interface ReferralsListProps {
	referrals: ReferralUser[]
	emptyMessage?: string
	emptyDescription?: string
}

export const ReferralsList = ({
	referrals,
	emptyMessage = 'هنوز کسی را دعوت نکرده‌اید',
	emptyDescription = 'کد دعوت خود را با دوستان به اشتراک بگذارید',
}: ReferralsListProps) => {
	return (
		<SectionPanel title={`دعوت‌شدگان (${referrals.length})`} size="sm">
			{referrals.length > 0 ? (
				<div className="space-y-2">
					{referrals.map((referral, index) => (
						<ReferralItem
							key={referral.userId || index}
							referral={referral}
						/>
					))}
				</div>
			) : (
				<div className="py-8 text-center">
					<FiGift size={48} className="mx-auto mb-4 text-muted" />
					<p className="mb-2 text-content">{emptyMessage}</p>
					<p className="text-sm text-muted">{emptyDescription}</p>
				</div>
			)}
		</SectionPanel>
	)
}
