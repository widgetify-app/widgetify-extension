import { getFaviconFromUrl } from '@/common/utils/icon'
import Modal from '@/components/modal'
import { TextInput } from '@/components/text-input'
import { useEffect, useRef, useState } from 'react'
import { FaImage, FaUpload } from 'react-icons/fa'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import type { Bookmark } from '../types/bookmark.types'
import { AdvancedModal } from './advanced.modal'

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
	const [formData, setFormData] = useState({
		title: '',
		url: '',
		icon: '',
		customImage: '',
		customBackground: '',
		customTextColor: '',
		sticker: '',
		touched: false,
	})

	const [iconSource, setIconSource] = useState<'auto' | 'upload' | 'url'>('auto')
	const [showAdvanced, setShowAdvanced] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [isDragging, setIsDragging] = useState(false)
	const [iconLoadError, setIconLoadError] = useState(false)

	const type = bookmark?.type

	const updateFormData = (key: string, value: string) => {
		setFormData((prev) => ({ ...prev, [key]: value }))
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

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		if (!file.type.startsWith('image/')) {
			alert('لطفاً فقط فایل تصویری آپلود کنید')
			return
		}

		const reader = new FileReader()
		reader.onloadend = () => {
			const base64String = reader.result as string
			updateFormData('customImage', base64String)
			setIconSource('upload')
		}
		reader.readAsDataURL(file)
	}

	const handleInputChange = (name: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[name]: value,
			touched: true,
		}))
	}

	const handleSave = () => {
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
			if (!formData.url.startsWith('http://') && !formData.url.startsWith('https://')) {
				newUrl = `https://${formData.url}`
			}
			;(updatedBookmark as any).url = newUrl.trim()
			;(updatedBookmark as any).icon = iconUrl || bookmark.icon
		}

		onSave(updatedBookmark)
		onClose()
	}

	const renderIconPreview = () => {
		const handlePreviewClick = () => fileInputRef.current?.click()
		const handleRemoveCustomImage = (e: React.MouseEvent) => {
			e.stopPropagation()
			updateFormData('customImage', '')
			setIconSource('auto')
		}

		const handleDragOver = (e: React.DragEvent) => {
			e.preventDefault()
			setIsDragging(true)
		}

		const handleDragLeave = () => {
			setIsDragging(false)
		}

		const handleDrop = (e: React.DragEvent) => {
			e.preventDefault()
			setIsDragging(false)

			const file = e.dataTransfer.files[0]
			if (!file || !file.type.startsWith('image/')) return

			const reader = new FileReader()
			reader.onloadend = () => {
				const base64String = reader.result as string
				updateFormData('customImage', base64String)
				setIconSource('upload')
			}
			reader.readAsDataURL(file)
		}

		if (formData.customImage) {
			return (
				<div
					className="relative w-12 h-12 mx-auto cursor-pointer group"
					onClick={handlePreviewClick}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
				>
					<img
						src={formData.customImage}
						alt="Custom"
						className="object-cover w-full h-full transition-opacity rounded-lg group-hover:opacity-75"
					/>
					<div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
						<FaUpload className="w-4 h-4 text-white" />
					</div>
					<button
						onClick={handleRemoveCustomImage}
						className="absolute z-10 p-1 text-red-400 bg-black rounded-full -top-2 -right-2 hover:text-red-300"
					>
						×
					</button>
				</div>
			)
		}

		if (type === 'BOOKMARK' && formData.icon && iconSource === 'auto') {
			return (
				<div
					className={`relative w-12 h-12 mx-auto cursor-pointer group ${isDragging ? 'ring-2 ring-blue-400' : ''}`}
					onClick={handlePreviewClick}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
				>
					<img
						src={formData.icon}
						alt="Favicon"
						className={`object-contain w-full h-full p-2 transition-opacity border rounded-lg ${
							theme === 'light' ? 'border-gray-300' : 'border-white/10'
						} group-hover:opacity-75 ${iconLoadError ? 'opacity-30' : ''}`}
						onError={() => {
							try {
								const urlObj = new URL(
									formData.url.startsWith('http')
										? formData.url
										: `https://${formData.url}`,
								)
								tryAlternativeFavicons(urlObj.hostname)
								setIconLoadError(true)
							} catch {
								updateFormData('icon', '')
								setIconLoadError(true)
							}
						}}
					/>
					<div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
						<FaUpload className="w-4 h-4 text-white" />
					</div>

					{iconLoadError && (
						<div className="absolute bottom-[-20px] left-0 right-0 text-center">
							<span className="text-xs text-yellow-500">آیکون بارگذاری نشد</span>
						</div>
					)}
				</div>
			)
		}

		return (
			<div
				className={`flex flex-col items-center justify-center w-16 h-16 mx-auto transition-colors border-2 border-dashed rounded-lg cursor-pointer ${
					isDragging ? 'border-blue-400 bg-blue-50/10' : ''
				}`}
				onClick={handlePreviewClick}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				<FaImage className="w-6 h-6 mb-1 text-gray-500" />
				<span className="text-xs text-center text-gray-500">آپلود تصویر</span>
			</div>
		)
	}

	const tryAlternativeFavicons = (hostname: string) => {
		const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`
		updateFormData('icon', googleFaviconUrl)
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
			size="sm"
			title={`✏️ ویرایش ${type === 'FOLDER' ? 'پوشه' : 'بوکمارک'}`}
			direction="rtl"
			closeOnBackdropClick={false}
		>
			<div className="relative h-full">
				<form className="flex flex-col gap-4 p-4">
					<div className="mb-2">
						{renderIconPreview()}
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
						onChange={handleImageUpload}
						name="imageFile"
					/>

					<TextInput
						type="text"
						name="title"
						placeholder={type === 'FOLDER' ? 'نام پوشه' : 'عنوان بوکمارک'}
						value={formData.title}
						onChange={(value) => handleInputChange('title', value)}
						className={
							'w-full px-4 py-3 text-right rounded-lg transition-all duration-200'
						}
					/>

					<div className="relative h-[54px]">
						{type === 'BOOKMARK' && (
							<TextInput
								name="url"
								type="text"
								placeholder="آدرس لینک"
								value={formData.url}
								onChange={(value) => handleInputChange('url', value)}
								className={
									'w-full px-4 py-3 text-right absolute rounded-lg transition-all'
								}
							/>
						)}
					</div>

					{formData.customImage && (
						<input type="hidden" name="customImage" value={formData.customImage} />
					)}
					{formData.customBackground && (
						<input
							type="hidden"
							name="customBackground"
							value={formData.customBackground}
						/>
					)}
					{formData.customTextColor && (
						<input
							type="hidden"
							name="customTextColor"
							value={formData.customTextColor}
						/>
					)}
					{formData.sticker && (
						<input type="hidden" name="sticker" value={formData.sticker} />
					)}

					<div className="flex items-center justify-end">
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
							className={`px-4 py-2 cursor-pointer rounded-lg ${getButtonStyle(false)}`}
						>
							لغو
						</button>
						<button
							onClick={() => handleSave()}
							className={`px-4 py-2 cursor-pointer rounded-lg ${getButtonStyle(true)}`}
							disabled={
								!formData.title?.trim() || (type === 'BOOKMARK' && !formData.url?.trim())
							}
						>
							ذخیره
						</button>
					</div>
				</form>
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

	function getButtonStyle(primary = false) {
		if (primary) {
			switch (theme) {
				case 'light':
					return 'bg-blue-500 hover:bg-blue-600 text-white'
				case 'dark':
					return 'bg-blue-600 hover:bg-blue-700 text-white'
				default: // glass
					return 'bg-blue-500/80 hover:bg-blue-500 text-white'
			}
		}

		switch (theme) {
			case 'light':
				return 'border border-gray-300 text-gray-600 hover:bg-gray-100'
			case 'dark':
				return 'border border-gray-700 text-gray-300 hover:bg-gray-700/50'
			default: // glass
				return 'border border-white/10 text-gray-400 hover:bg-white/5'
		}
	}
}

function IconSourceSelector({
	iconSource,
	setIconSource,
	theme = 'glass',
}: {
	iconSource: 'auto' | 'upload' | 'url'
	setIconSource: (source: 'auto' | 'upload' | 'url') => void
	theme?: string
}) {
	const getButtonStyle = (isActive: boolean) => {
		if (isActive) {
			switch (theme) {
				case 'light':
					return 'bg-blue-100 text-blue-700 border-blue-300'
				case 'dark':
					return 'bg-blue-900/30 text-blue-300 border-blue-800'
				default:
					return 'bg-blue-800/20 text-blue-400 border-blue-800/50'
			}
		}

		switch (theme) {
			case 'light':
				return 'bg-gray-100 text-gray-700 border-gray-200'
			case 'dark':
				return 'bg-neutral-800 text-gray-400 border-neutral-700'
			default:
				return 'bg-neutral-800/50 text-gray-500 border-neutral-700/50'
		}
	}

	return (
		<div className="flex justify-center gap-1 mt-1 text-[10px]">
			<button
				type="button"
				onClick={() => setIconSource('auto')}
				className={`px-2 py-1 cursor-pointer border rounded ${getButtonStyle(iconSource === 'auto')}`}
			>
				خودکار
			</button>
			<button
				type="button"
				onClick={() => setIconSource('upload')}
				className={`px-2 py-1 cursor-pointer border rounded ${getButtonStyle(iconSource === 'upload')}`}
			>
				آپلود
			</button>
		</div>
	)
}
