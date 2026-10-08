import Analytics from '@/analytics'
import { t } from '@/common/i18n'
import { Tooltip } from '@/components/ui'

export function VoiceSearchButton({ onClick }: { onClick: () => void }) {
	const onClickHandle = () => {
		Analytics.event('searchbox_open_voice_search')
		onClick()
	}

	return (
		<Tooltip content={t('widgets.search.voice.tooltip')}>
			<button
				type="button"
				onClick={onClickHandle}
				aria-label={t('widgets.search.voice.aria')}
				className="grid rounded-lg cursor-pointer size-7 place-items-center shrink-0 text-fg-muted transition-ui hover:bg-fill-2 hover:text-fg-strong focus-visible:focus-ring"
			>
				<svg
					className="size-4"
					viewBox="0 -960 960 960"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path
						fill="currentColor"
						d="M480-400q-50 0-85-35t-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35Zm-40 280v-123q-104-14-172-93t-68-184h80q0 83 58.5 141.5T480-320q83 0 141.5-58.5T680-520h80q0 105-68 184t-172 93v123h-80Z"
					/>
				</svg>
			</button>
		</Tooltip>
	)
}
