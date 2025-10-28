import { FiGift } from 'react-icons/fi'
import type { ReferralUser } from '@/services/hooks/user/referralsService.hook'

interface ReferralItemProps {
	referral: ReferralUser
	status?: string
}

export const ReferralItem = ({ referral, status = 'دعوت شده' }: ReferralItemProps) => {
	const { name, avatar } = referral

	return (
		<div className="flex items-center gap-3 p-3 bg-content rounded-2xl">
			<img
				src={avatar}
				alt={name}
				className="object-cover w-10 h-10 rounded-full"
			/>
			<div className="flex-1">
				<p className="font-medium text-content">{name}</p>
			</div>
			<div className="flex items-center gap-1 text-primary">
				<FiGift size={16} />
				<span className="text-xs">{status}</span>
			</div>
		</div>
	)
}
