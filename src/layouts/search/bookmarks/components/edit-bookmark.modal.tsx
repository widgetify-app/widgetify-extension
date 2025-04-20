import { getFaviconFromUrl } from '@/common/utils/icon'
import Modal from '@/components/modal'
import { TextInput } from '@/components/text-input'
import { getButtonStyles } from '@/context/theme.context'
import { useEffect, useState, useTransition } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import type { Bookmark, BookmarkType } from '../types/bookmark.types'
import { AdvancedModal } from './advanced.modal'
import {
	type BookmarkFormData,
	IconSourceSelector,
	type IconSourceType,
	useBookmarkIcon,
} from './shared'

interface EditBookmarkModalProps {
	isOpen: boolean
	onClose: () => void
	onSave: (bookmark: Bookmark) => void
	bookmark: Bookmark
	theme?: string
}

export function EditBookmarkModal({
	isOpen,
	onClose,
	onSave,
	bookmark,
	theme = 'glass',
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
	})

	const [iconSource, setIconSource] = useState<IconSourceType>('auto')
	const [showAdvanced, setShowAdvanced] = useState(false)
	const [isPending, startTransition] = useTransition()

	const type = bookmark?.type

	const { fileInputRef, setIconLoadError, renderIconPreview, handleImageUpload } =
		useBookmarkIcon(theme)

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
		data: { background?: string; textColor?: string; sticker?: string } | null,
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
			title={`✏️ ویرایش ${type === 'FOLDER' ? 'پوشه' : 'بوکمارک'}`}
			direction="rtl"
			closeOnBackdropClick={false}
			className="!overflow-y-hidden"
		>
			<div className="flex flex-col gap-2 p-2 overflow-y-auto h-80">
				<div className="mb-2">
					{renderIconPreview(
						formData,
						iconSource,
						setIconSource,
						updateFormData,
						type as BookmarkType,
					)}
					<p className="mt-2 text-xs text-center text-gray-500">
						برای آپلود تصویر کلیک کنید یا فایل را بکشید و رها کنید
					</p>
					{type === 'BOOKMARK' && (
						<IconSourceSelector
							iconSource={iconSource}
							setIconSource={setIconSource}
							theme={theme}
						/>
					)}
				</div>
				<input
					type="file"
					ref={fileInputRef}
					className="hidden"
					accept="image/*"
					onChange={(e) => handleImageUpload(e, updateFormData, setIconSource)}
				/>

				<TextInput
					type="text"
					name="title"
					placeholder={type === 'FOLDER' ? 'نام پوشه' : 'عنوان بوکمارک'}
					value={formData.title}
					onChange={(value) => updateFormData('title', value)}
					className={'w-full px-4 py-3 text-right rounded-lg transition-all duration-200'}
				/>

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

				<div className={'flex items-center justify-end'}>
					<button
						type="button"
						onClick={() => setShowAdvanced(!showAdvanced)}
						className={`flex items-center gap-1 px-2 py-1 text-sm font-medium text-gray-500 transition-colors duration-200 cursor-pointer ${theme === 'light' ? 'hover:text-gray-700' : 'hover:text-gray-300'}`}
					>
						{showAdvanced ? (
							<>
								<span>گزینه‌های کمتر</span>
								<FiChevronUp className="w-4 h-4" />
							</>
						) : (
							<>
								<span>گزینه‌های بیشتر</span>
								<FiChevronDown className="w-4 h-4" />
							</>
						)}
					</button>
				</div>

				<div className="flex justify-between mt-4">
					<button
						type="button"
						onClick={onClose}
						className={`px-4 py-2 cursor-pointer rounded-lg ${getButtonStyles(theme, false)}`}
					>
						لغو
					</button>
					<button
						type="button"
						onClick={handleSave}
						className={`px-4 py-2 cursor-pointer rounded-lg ${getButtonStyles(theme, true)}`}
						disabled={
							!formData.title?.trim() ||
							(type === 'BOOKMARK' && !formData.url?.trim()) ||
							isPending
						}
					>
						{isPending ? 'در حال ذخیره...' : 'ذخیره'}
					</button>
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
