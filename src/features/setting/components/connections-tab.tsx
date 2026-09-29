import { Alert, SectionPanel } from '@/components/ui'
import { Connections } from '../account/user-profile/connections/connections'

export const ConnectionPlatformsTab = () => {
	return (
		<div className="space-y-2">
			<SectionPanel title="مدیریت پلتفرم ها" size="xs">
				<Alert tone="info">
					اینجا می‌تونی پلتفرم‌های مختلف رو به ویجتیفای وصل کنی و امکانات مرتبط رو
					فعال کنی. هر زمان هم خواستی، اتصال رو قطع کن
				</Alert>

				<Connections />
			</SectionPanel>
		</div>
	)
}
