import { useEffect, useRef, useState } from 'react'
import { showToast } from '@/common/toast'
import { TextInput } from '@/components/text-input'
import Analytics from '@/analytics'
import { RequireAuth } from '@/components/auth/require-auth'
import { getMainClient } from '@/services/api'
import { translateError } from '@/common/utils/translate-error'
import { Button, Portal } from '@/components/ui'
import { Motion } from '@/common/motion'
import { Icon } from '@/src/icons'

interface ImageSearchPortalProps {
	onClose: () => void
	portalStyles?: React.CSSProperties
	portalRef: React.RefObject<HTMLDivElement | null>
}

export function ImageSearchPortal({
	onClose,
	portalStyles,
	portalRef,
}: ImageSearchPortalProps) {
	const [isUploading, setIsUploading] = useState(false)
	const [imageUrl, setImageUrl] = useState('')
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [uploadProgress, setUploadProgress] = useState(0)

	useEffect(() => {
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl)
			}
		}
	}, [previewUrl])

	const handleUpload = async (file: File) => {
		if (!file || !file.type?.startsWith('image/')) {
			showToast('لطفا فقط فایل تصویری انتخاب کنید', 'error')
			return
		}

		if (file.size > 1 * 1024 * 1024) {
			showToast('حجم فایل نباید بیشتر از ۱ مگابایت باشد', 'error')
			return
		}

		const objectUrl = URL.createObjectURL(file)
		setPreviewUrl(objectUrl)
		setIsUploading(true)
		setUploadProgress(0)
		Analytics.event('searchbox_image_file')

		try {
			const formData = new FormData()
			formData.append('image', file)

			const client = getMainClient()
			const response = await client.post('/users/@me/upload/search', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				onUploadProgress: (progressEvent) => {
					const percentCompleted = Math.round(
						(progressEvent.loaded * 100) / (progressEvent.total || 1)
					)
					setUploadProgress(percentCompleted)
				},
			})

			const data = response.data
			window.open(
				`https://www.google.com/searchbyimage?image_url=${encodeURIComponent(data.url)}&client=chrome`,
				'_blank'
			)
			onClose()
		} catch (er) {
			showToast(translateError(er) as string, 'error')
		} finally {
			setIsUploading(false)
			if (objectUrl) {
				URL.revokeObjectURL(objectUrl)
			}
			setPreviewUrl(null)
		}
	}

	const handleUrlSearch = () => {
		if (!imageUrl) return
		window.open(
			`https://www.google.com/searchbyimage?image_url=${encodeURIComponent(imageUrl)}&client=chrome`,
			'_blank'
		)
		Analytics.event('searchbox_image_url')

		onClose()
	}

	return (
		<Portal>
			<Motion.div
				ref={portalRef}
				style={portalStyles}
				initial={{ opacity: 0, y: -8 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.18, ease: 'easeOut' }}
				className="z-20 p-4 overflow-hidden shadow-2xl bg-content bg-glass -mt-26 rounded-2xl"
			>
				<div className="flex items-center justify-between px-2 mb-4">
					<span className="text-sm font-black text-base-content/80">
						جستجوی تصویر با گوگل
					</span>
					<div className="flex flex-row items-center gap-1">
						<a
							href="https://widgetify.ir/privacy?target=search"
							className="p-1 transition-colors rounded-full cursor-pointer hover:bg-base-200 text-base-content/50"
							target="_blank"
							rel="noreferrer"
						>
							<Icon name="outlinePrivacyTip" size={18} />
						</a>
						<button
							onClick={onClose}
							className="p-1 transition-colors rounded-full cursor-pointer hover:bg-base-200 text-base-content/50"
						>
							<Icon name="close" size={22} />
						</button>
					</div>
				</div>

				<div className="flex flex-col gap-4">
					<RequireAuth mode="preview">
						<div
							onDragOver={(e) => e.preventDefault()}
							onDrop={(e) => {
								e.preventDefault()
								const file = e.dataTransfer.files[0]
								if (file) handleUpload(file)
							}}
							className="relative flex flex-col items-center justify-center py-6 transition-all border-2 border-dashed cursor-pointer group border-base-content/10 rounded-2xl hover:border-primary/40 hover:bg-primary/5"
							onClick={() => fileInputRef.current?.click()}
						>
							<div className="flex items-center justify-center w-10 h-10 mb-2 transition-colors rounded-full bg-base-200 group-hover:text-primary">
								<svg
									width="36"
									height="36"
									viewBox="0 0 48 48"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M14 22H14.02"
										stroke="#4285F4"
										strokeWidth="4"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M34 22H34.02"
										stroke="#EA4335"
										strokeWidth="4"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M24 30H24.02"
										stroke="#FBBC05"
										strokeWidth="4"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M34 38H14C10.6863 38 8 35.3137 8 32V16C8 12.6863 10.6863 10 14 10H34C37.3137 10 40 12.6863 40 16V32C40 35.3137 37.3137 38 34 38Z"
										stroke="#34A853"
										strokeWidth="3"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</div>
							<p className="text-xs font-bold text-base-content/60">
								یک تصویر را اینجا بکشید یا{' '}
								<span className="text-primary hover:underline">
									فایل را انتخاب کنید
								</span>
							</p>
							{isUploading && (
								<div className="absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-base-100">
									{previewUrl && (
										<img
											src={previewUrl}
											alt="پیش‌نمایش تصویر"
											className="absolute inset-0 object-cover w-full h-full opacity-30"
										/>
									)}

									<div className="relative flex flex-col items-center w-full gap-3 px-12">
										<span className="loading loading-spinner loading-md text-primary"></span>

										<div className="flex flex-col items-center gap-1">
											<span className="text-xs font-black text-base-content">
												{uploadProgress < 100
													? 'در حال ارسال تصویر...'
													: 'در حال جستجو در گوگل...'}
											</span>
											<span className="text-[10px] font-bold text-base-content/40 tracking-widest">
												{uploadProgress}%
											</span>
										</div>

										<div className="w-full h-1 overflow-hidden rounded-full bg-base-content/10">
											<div
												className="h-full transition-all duration-300 bg-primary"
												style={{ width: `${uploadProgress}%` }}
											></div>
										</div>
									</div>
								</div>
							)}
						</div>
					</RequireAuth>
					<div className="flex items-center gap-2 p-1 border bg-base-200 rounded-xl border-base-content/5">
						<div className="pl-3 text-base-content/30">
							<Icon name="link" size={20} />
						</div>
						<TextInput
							type="url"
							value={imageUrl}
							onChange={(v) => setImageUrl(v)}
							placeholder="لینک تصویر را پیست کنید..."
							className="flex-1 py-2 text-xs bg-transparent border-none! outline-none! ring-transparent! focus:placeholder:opacity-50"
							onKeyDown={(e) => e.key === 'Enter' && handleUrlSearch()}
							direction={imageUrl ? 'auto' : 'rtl'}
						/>
						<Button
							onClick={handleUrlSearch}
							size="sm"
							variant={'primary'}
							rounded={'2xl'}
							className="w-20"
						>
							جستجو
						</Button>
					</div>
				</div>

				<input
					type="file"
					ref={fileInputRef}
					className="hidden"
					accept="image/jpeg, image/png, image/webp, image/gif"
					onChange={(e) =>
						e.target.files?.[0] && handleUpload(e.target.files[0])
					}
				/>
			</Motion.div>
		</Portal>
	)
}
