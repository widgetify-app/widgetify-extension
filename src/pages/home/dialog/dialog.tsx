import Analytics from '@/analytics'
import { getContrastingTextColor } from '@/common/color'
import { callEvent } from '@/common/utils/call-event'
import { Button } from '@/components/button/button'
import Modal from '@/components/modal'
import { useAuth } from '@/context/auth.context'
import { safeAwait } from '@/services/api'
import {
	useGetNotifications,
	useNotifyAsSeen,
} from '@/services/hooks/extension/getNotifications.hook'

export function DialogChecker() {
	const { isAuthenticated } = useAuth()
	const [show, setShow] = useState(false)
	const { data } = useGetNotifications({
		enabled: isAuthenticated,
	})
	const { mutateAsync: asSeen } = useNotifyAsSeen()

	useEffect(() => {
		const isDialogAvailable = document.querySelector('.modal')
		if (isDialogAvailable) return

		let timer: any

		if (data?.dialog) {
			timer = setTimeout(() => {
				setShow(true)
			}, 2000)
		}

		return () => {
			if (timer) clearTimeout(timer)
		}
	}, [data?.dialog])

	const onClose = async () => {
		if (!data?.dialog?.id) return

		setShow(false)
		await safeAwait(asSeen(data.dialog.id))
	}

	const onButtonClick = async () => {
		if (!data?.dialog?.id) return
		const { type, goTo, target, link } = data.dialog

		if (type === 'page' && goTo) {
			callEvent('go_to_page', goTo as any)
			Analytics.event('dialog_page')
		} else if (type === 'action') {
			callEvent(goTo as any, target as any)
			Analytics.event('dialog_action')
		} else if (type === 'url') {
			window.open(link, '_blank')
		}

		setShow(false)
		safeAwait(asSeen(data?.dialog?.id))
	}

	if (!data?.dialog) return null
	const dialog = data.dialog
	return (
		<Modal
			isOpen={show}
			onClose={() => onClose()}
			title={dialog.dialogTitle || ' '}
			direction="rtl"
			showCloseButton={true}
		>
			<div className="flex flex-col gap-3 p-2">
				{dialog.media ? (
					<div className="w-full h-40">{renderMedia(dialog.media)}</div>
				) : null}
				<h2 className="text-lg font-bold text-start">{dialog.title}</h2>
				<p className="text-start">{dialog.description}</p>

				<div className="flex flex-col gap-2">
					{dialog.link && (
						<Button
							size="md"
							onClick={() => onButtonClick()}
							className="flex items-center justify-center gap-2 text-lg shadow-md"
							rounded="xl"
							style={{
								backgroundColor: dialog.buttonColor || undefined,
								color: dialog.buttonColor
									? getContrastingTextColor(dialog.buttonColor || '')
									: undefined,
							}}
						>
							{dialog.buttonLabel || 'مشاهده'}
						</Button>
					)}

					<Button size="md" onClick={() => onClose()} rounded="xl">
						بستن
					</Button>
				</div>
			</div>
		</Modal>
	)
}

const isVideo = (media: string) => {
	return media.endsWith('.mp4') || media.endsWith('.webm') || media.endsWith('.ogg')
}

function renderMedia(media: string) {
	if (isVideo(media)) {
		return (
			<video controls className="object-cover w-full h-full rounded-xl">
				<source src={media} type={`video/${media.split('.').pop()}`} />
				<track kind="captions" srcLang="en" label="English" />
			</video>
		)
	}
	return (
		<img
			src={media}
			alt="Dialog media"
			className="object-cover w-full h-full rounded-xl"
		/>
	)
}
