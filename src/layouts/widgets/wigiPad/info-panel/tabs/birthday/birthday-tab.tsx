import type { InfoPanelData } from '../../hooks/useInfoPanelData'
import { BirthdayItem } from './birthday-item'

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
				<div className="py-8 text-center opacity-50 text-base-content">
					<div className="mb-2 text-2xl">🎂</div>
					<p className="text-sm">هیچ تولدی امروز نیست</p>
				</div>
			)}
		</div>
	)
}
