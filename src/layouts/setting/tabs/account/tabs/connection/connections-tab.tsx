import { SectionPanel } from '@/components/ui'
import { Connections } from '../user-profile/connections/connections'
import { Icon } from '@/icons'

export const ConnectionPlatformsTab = () => {
	return (
		<div className="space-y-2">
			<SectionPanel title="مدیریت پلتفرم ها" size="xs">
				<div className="relative p-2 border rounded-2xl bg-content border-content">
					<div className="flex items-start gap-3">
						<div className="flex items-center justify-center w-8 h-8 rounded-xl bg-brand-subtle shrink-0">
							<Icon name="info" className="w-4 h-4 text-primary" />
						</div>

						<p className="text-xs leading-6 text-muted">
							اینجا می‌تونی پلتفرم‌های مختلف رو به ویجتیفای وصل کنی و امکانات
							مرتبط رو فعال کنی. هر زمان هم خواستی، اتصال رو قطع کن.
						</p>
					</div>
				</div>

				<Connections />
			</SectionPanel>
		</div>
	)
}
