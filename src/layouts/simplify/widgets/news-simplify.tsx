import { callEvent } from '@/common/utils/call-event'
import { Button } from '@/components/button/button'
import { WidgetTabKeys } from '@/layouts/widgets-settings/constant/tab-keys'
import { NewsLayout } from '@/layouts/widgets/news/news.layout'
import { FaGear } from 'react-icons/fa6'

export function NewsSimplify() {
	const onClick = () => {
		callEvent('openWidgetsSettings', {
			tab: WidgetTabKeys.news_settings,
		})
	}
	return (
		<div className="overflow-y-auto h-82 scrollbar-none">
			<div className="sticky z-20 flex justify-start px-2 top-1">
				<Button
					onClick={onClick}
					size="xs"
					className="absolute left-0 flex items-center justify-center w-6 h-6 p-0 rounded-full"
				>
					<FaGear size={12} className="text-muted" />
				</Button>
			</div>

			<NewsLayout inComboWidget enableBackground={false} />
		</div>
	)
}
