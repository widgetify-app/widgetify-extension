import { useRef, useState } from 'react'
import { WidgetContainer } from '../widget-container'
import type { WidgetSize } from '../layout-engine/types'
import { useFreeWidgets } from '@/context/free-widget/free-widget.context'
import { useAppearance } from '@/context/appearance.context'
import { useAuth } from '@/context/auth.context'
import { Icon } from '@/src/icons'
import { showToast } from '@/common/toast'
import { translateError } from '@/common/utils/translate-error'
import { safeAwait } from '@/services/api'
import { uploadWidgetMediaApi } from '@/services/hooks/widgets/widget-media.hook'
import { callEvent } from '@/common/utils/call-event'
import type { AxiosError } from 'axios'

interface PhotoWidgetProps {
	size?: WidgetSize
	meta?: { imageSrc?: string }
	instanceId?: string
}

export function PhotoWidget({ size = { w: 2, h: 2 }, meta, instanceId }: PhotoWidgetProps) {
	const { updateWidgetSettings } = useFreeWidgets()
	const { canvasMode } = useAppearance()
	const { isVip } = useAuth()
	const inputRef = useRef<HTMLInputElement>(null)
	const [isUploading, setIsUploading] = useState(false)

	const is1x1 = size.w === 1 && size.h === 1
	const imageSrc = meta?.imageSrc

	const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		if (!isVip) {
			callEvent('openSettings', 'vip')
			return
		}

		if (!file.type.startsWith('image/')) {
			showToast('لطفا یک فایل تصویری انتخاب کن', 'error')
			return
		}

		if (file.size > 1024 * 1024) {
			showToast('حجم عکس نباید بیشتر از ۱ مگابایت باشه', 'error')
			return
		}

		if (!instanceId) return

		setIsUploading(true)
		const [err, res] = await safeAwait<AxiosError, { url: string }>(
			uploadWidgetMediaApi(instanceId, file)
		)
		setIsUploading(false)

		if (err || !res?.url) {
			showToast(translateError(err) as string, 'error')
			return
		}

		updateWidgetSettings(instanceId, { imageSrc: res.url })
		showToast('عکس با موفقیت ذخیره شد', 'success')
		e.target.value = ''
	}

	const handleClick = () => {
		if (canvasMode !== 'edit' && !isUploading) {
			if (!isVip) {
				callEvent('openSettings', 'vip')
				return
			}
			inputRef.current?.click()
		}
	}

	return (
		<WidgetContainer padding={false} className="cursor-pointer">
			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={handleUpload}
			/>

			{imageSrc ? (
				<div className="relative w-full h-full overflow-hidden">
					<img
						src={imageSrc}
						alt="عکس"
						onClick={handleClick}
						className="w-full h-full object-cover"
					/>
					{isUploading && (
						<div className="absolute inset-0 bg-black/40 flex items-center justify-center">
							<span className="loading loading-spinner text-content" />
						</div>
					)}
				</div>
			) : (
				<button
					type="button"
					onClick={handleClick}
					className="group relative w-full h-full flex flex-col items-center justify-center gap-2.5 p-3 text-content/70 hover:text-content transition-all cursor-pointer select-none"
				>
					{isUploading ? (
						<span className="loading loading-spinner text-content" />
					) : (
						<>
							<div className="w-10 h-10 rounded-full bg-base-300/60 group-hover:bg-base-300 flex items-center justify-center transition-colors duration-200">
								<Icon
									name="image"
									size={is1x1 ? 16 : 18}
									className="text-content/70 group-hover:text-content transition-colors"
								/>
							</div>

							<span
								className={`text-center font-medium transition-colors ${
									is1x1
										? 'text-[10px] text-content/60'
										: 'text-xs text-content/75 group-hover:text-content'
								}`}
							>
								{is1x1 ? 'افزودن عکس' : 'یه عکس بذار که حالت رو خوب کنه'}
							</span>
						</>
					)}
				</button>
			)}
		</WidgetContainer>
	)
}
