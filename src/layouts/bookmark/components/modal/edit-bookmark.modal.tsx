import { getFaviconFromUrl } from '@/common/utils/icon'
import { Button } from '@/components/button/button'
import Modal from '@/components/modal'
import { TextInput } from '@/components/text-input'
import { useEffect, useState, useTransition } from 'react'
import type { Bookmark, BookmarkType } from '../../types/bookmark.types'
import {
	type BookmarkFormData,
	IconSourceSelector,
	type IconSourceType,
	ShowAdvancedButton,
	useBookmarkIcon,
} from '../shared'
import { AdvancedModal } from './advanced.modal'

interface EditBookmarkModalProps {
	isOpen: boolean
	onClose: () => void
	onSave: (bookmark: Bookmark) => void
	bookmark: Bookmark
}

export function EditBookmarkModal({
	isOpen,
	onClose,
	onSave,
	bookmark,
}: EditBookmarkModalProps) {
	const [formData, setFormData] = useState<BookmarkFormData>({
		title: '',
		url: '',
		icon: '',
		customImage: '',
		customBackground: '',
		customTextColor: '',
		sticker: '',
		touched: false,
		password: '',
	})

	const [iconSource, setIconSource] = useState<IconSourceType>('auto')
	const [showAdvanced, setShowAdvanced] = useState(false)
	const [isPending, startTransition] = useTransition()

	const type = bookmark?.type

	const { fileInputRef, setIconLoadError, renderIconPreview, handleImageUpload } =
		useBookmarkIcon()

	const updateFormData = (key: string, value: string) => {
		setFormData((prev) => ({ ...prev, [key]: value, touched: true }))
	}

	useEffect(() => {
		if (bookmark) {
			setFormData({
				title: bookmark.title,
				url: bookmark.type === 'BOOKMARK' ? bookmark.url : '',
				icon:
					bookmark.type === 'BOOKMARK'
						? bookmark.icon || getFaviconFromUrl(bookmark.url)
						: '',
				customImage: bookmark.customImage || '',
				customBackground: bookmark.customBackground || '',
				customTextColor: bookmark.customTextColor || '',
				sticker: bookmark.sticker || '',
				touched: false,
				password: bookmark.password,
			})

			setIconSource(bookmark.customImage ? 'upload' : 'auto')
		}
	}, [bookmark])

	useEffect(() => {
		if (iconSource === 'auto' && formData.url && formData.touched) {
			setIconLoadError(false)
			const url = formData.url
			requestAnimationFrame(() => {
				updateFormData('icon', getFaviconFromUrl(url))
			})
		}
	}, [formData.url, iconSource, formData.touched])

	const handleSave = () => {
		startTransition(() => {
			if (!formData.title?.trim() || !bookmark) return

			let iconUrl: string | undefined = undefined
			if (
				type === 'BOOKMARK' &&
				iconSource === 'auto' &&
				formData.icon &&
				!formData.customImage
			) {
				iconUrl = getFaviconFromUrl(formData.url)
			}

			const updatedBookmark = {
				...bookmark,
				title: formData.title.trim(),
				customImage: formData.customImage,
				customBackground: formData.customBackground || undefined,
				customTextColor: formData.customTextColor || undefined,
				sticker: formData.sticker || undefined,
				password: formData.password || undefined,
			}

			if (type === 'BOOKMARK') {
				let newUrl = formData.url
				if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
					newUrl = `https://${newUrl}`
				}
				updatedBookmark.url = newUrl.trim()
				updatedBookmark.icon = iconUrl || bookmark.icon
			}

			onSave(updatedBookmark)
			onClose()
		})
	}

	const handleAdvancedModalClose = (
		data: { background?: string; textColor?: string; sticker?: string } | null
	) => {
		setShowAdvanced(false)

		if (data) {
			if (data.background !== undefined) {
				updateFormData('customBackground', data.background)
			}

			if (data.textColor !== undefined) {
				updateFormData('customTextColor', data.textColor)
			}

			if (data.sticker !== undefined) {
				updateFormData('sticker', data.sticker)
			}
		}
	}

	if (!bookmark) return null

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="md"
			title={`ویرایش ${type === 'FOLDER' ? 'پوشه' : 'بوکمارک'}`}
			direction="rtl"
			className="!overflow-y-hidden"
		>
			<div className="flex flex-col justify-between gap-2 overflow-y-auto h-[23rem]">
				<div className="flex flex-col gap-2">
					<div className="flex flex-col items-center gap-4">
						{type === 'BOOKMARK' && (
							<IconSourceSelector
								iconSource={iconSource}
								setIconSource={setIconSource}
							/>
						)}
						{renderIconPreview(
							formData,
							iconSource,
							setIconSource,
							updateFormData,
							type as BookmarkType
						)}
						<p className="mb-2 text-xs text-center text-content">
							برای آپلود تصویر کلیک کنید یا فایل را بکشید و رها کنید
						</p>
					</div>

					<input
						type="file"
						ref={fileInputRef}
						className="hidden"
						accept="image/*"
						onChange={(e) =>
							handleImageUpload(e, updateFormData, setIconSource)
						}
					/>

					<TextInput
						type="text"
						name="title"
						placeholder={type === 'FOLDER' ? 'نام پوشه' : 'عنوان بوکمارک'}
						value={formData.title}
						onChange={(value) => updateFormData('title', value)}
						className={
							'w-full px-4 py-3 text-right rounded-lg transition-all duration-200'
						}
					/>

					{type === 'FOLDER' && (
						<div className="relative h-[50px]">
							<TextInput
								type="password"
								name="password"
								placeholder="رمز عبور (اختیاری)"
								value={formData.password ?? ''}
								onChange={(v) => updateFormData('password', v)}
								className={
									'mt-2 w-full px-4 py-3 text-right absolute rounded-lg transition-all duration-300'
								}
							/>
						</div>
					)}

					<div className="relative h-[50px]">
						{type === 'BOOKMARK' && (
							<TextInput
								name="url"
								type="text"
								placeholder="آدرس لینک"
								value={formData.url}
								onChange={(value) => updateFormData('url', value)}
								className={
									'w-full px-4 py-3 text-right absolute rounded-lg transition-all duration-300'
								}
							/>
						)}
					</div>
				</div>

				<div className="flex justify-between gap-x-4">
					<ShowAdvancedButton
						showAdvanced={showAdvanced}
						setShowAdvanced={setShowAdvanced}
					/>

					<div className="flex items-center gap-x-2">
						<Button
							onClick={onClose}
							size="md"
							className={
								'btn btn-circle !bg-base-300 hover:!bg-error/10 text-muted hover:!text-error px-10 border-none shadow-none rounded-xl transition-colors duration-300 ease-in-out'
							}
						>
							لغو
						</Button>
						<Button
							onClick={handleSave}
							disabled={
								!formData.title?.trim() ||
								(type === 'BOOKMARK' && !formData.url?.trim()) ||
								isPending
							}
							size="md"
							isPrimary={true}
							className={
								'btn btn-circle !w-fit px-8 border-none shadow-none text-secondary rounded-xl transition-colors duration-300 ease-in-out'
							}
						>
							{isPending ? 'در حال ذخیره' : 'ذخیره'}
						</Button>
					</div>
				</div>
			</div>

			<AdvancedModal
				isOpen={showAdvanced}
				onClose={handleAdvancedModalClose}
				bookmark={{
					customBackground: formData.customBackground,
					customTextColor: formData.customTextColor,
					sticker: formData.sticker,
					type,
					title: formData.title,
					url: formData.url,
				}}
				title="گزینه‌های پیشرفته"
			/>
		</Modal>
	)
}
