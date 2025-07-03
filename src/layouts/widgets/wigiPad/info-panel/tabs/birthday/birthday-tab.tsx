import type { InfoPanelData } from '../../hooks/useInfoPanelData'
import { BirthdayItem } from './birthday-item'
import { LuGift } from 'react-icons/lu'

interface Props {
	birthdays: InfoPanelData['birthdays']
}
export function BirthdayTab({ birthdays }: Props) {
	return (
		<div className="space-y-2">
			{birthdays.length > 0 ? (
				birthdays.map((birthday) => (
					<BirthdayItem key={birthday.id} birthday={birthday} />
				))
			) : (
				<div className="py-1.5 flex flex-col items-center gap-y-2 text-center text-muted">
					<LuGift className="text-3xl" />
					<p className="text-xs leading-normal">هیچ تولدی امروز نیست.</p>
				</div>
			)}
		</div>
	)
}
