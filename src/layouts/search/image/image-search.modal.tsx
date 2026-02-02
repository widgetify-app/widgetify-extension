import { useRef, useState } from 'react'
import { MdClose, MdLink, MdOutlinePrivacyTip } from 'react-icons/md'
import { Button } from '@/components/button/button'
import { showToast } from '@/common/toast'
import { TextInput } from '@/components/text-input'
import Analytics from '@/analytics'
import { RequireAuth } from '@/components/auth/require-auth'
import { getMainClient } from '@/services/api'
import { translateError } from '@/utils/translate-error'

export function ImageSearchPortal({ onClose }: { onClose: () => void }) {
	const [isUploading, setIsUploading] = useState(false)
	const [imageUrl, setImageUrl] = useState('')
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [uploadProgress, setUploadProgress] = useState(0)
	const handleUpload = async (file: File) => {
		if (!file.type.startsWith('image/')) {
			showToast('لطفاً فقط فایل تصویری انتخاب کنید', 'error')
			return
		}

		if (file.size > 1 * 1024 * 1024) {
			showToast('حجم فایل نباید بیشتر از ۱ مگابایت باشد', 'error')
			return
		}

		setIsUploading(true)
		setUploadProgress(0)
		Analytics.event('searchbox_image_file')

		try {
			const formData = new FormData()
			formData.append('image', file)

			const client = await getMainClient()
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
		<div className="absolute top-0 left-0 w-full min-h-[160px] z-[60] bg-base-100 rounded-3xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
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
						<MdOutlinePrivacyTip size={18} />
					</a>
					<button
						onClick={onClose}
						className="p-1 transition-colors rounded-full cursor-pointer hover:bg-base-200 text-base-content/50"
					>
						<MdClose size={22} />
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
						className="relative flex flex-col items-center justify-center py-8 transition-all border-2 border-dashed cursor-pointer group border-base-content/10 rounded-2xl hover:border-primary/40 hover:bg-primary/5"
						onClick={() => fileInputRef.current?.click()}
					>
						<div className="flex items-center justify-center w-12 h-12 mb-2 transition-colors rounded-full bg-base-200 group-hover:text-primary">
							<svg
								width="42"
								height="42"
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
								<img
									src={URL.createObjectURL(
										fileInputRef.current?.files?.[0] as File
									)}
									className="absolute inset-0 object-cover w-full h-full opacity-30"
								/>

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
						<MdLink size={20} />
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
						isPrimary={true}
						className="w-20 rounded-2xl"
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
				onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
			/>
		</div>
	)
}
