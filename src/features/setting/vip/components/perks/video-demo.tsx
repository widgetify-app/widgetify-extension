import { t } from '@/common/i18n'
import { Icon } from '@/icons'
import { SunsetSea } from '../sunset-sea'

export function VideoDemo() {
	return (
		<div className="relative w-75 h-33">
			<div className="absolute inset-0 overflow-hidden shadow-lg rounded-2xl">
				<SunsetSea />
				<span className="absolute grid border rounded-full top-2.5 left-2.5 size-7.5 place-items-center bg-image-fill border-image-line text-image-fg">
					<Icon name="play" size={12} fill="currentColor" />
				</span>
				<span className="absolute overflow-hidden rounded-full inset-x-3 bottom-2.5 h-0.75 bg-image-line">
					<span className="block h-full origin-left bg-image-fg animate-pro-timeline" />
				</span>
			</div>
			<span className="absolute inline-flex items-center gap-1.5 px-3 text-xs font-extrabold border rounded-full shadow-lg -bottom-3.5 -right-3 h-7.5 whitespace-nowrap bg-surface border-line text-fg-strong">
				<Icon name="userCheck" size={16} className="text-vip" />
				{t('setting.vip.videoSaved')}
			</span>
		</div>
	)
}
