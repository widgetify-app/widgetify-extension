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
				<div
					className={
						'flex-1 flex flex-col items-center justify-center gap-y-1.5 px-5 py-1'
					}
				>
					<div
						className={
							'flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-base-300/70 border-base/70'
						}
					>
						<LuGift className="text-content" size={24} />
					</div>
					<p className="mt-1 text-center text-content">هیچ تولدی امروز نیست.</p>
				</div>
			)}
		</div>
	)
}
