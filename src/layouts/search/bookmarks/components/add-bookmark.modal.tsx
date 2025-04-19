import { getFaviconFromUrl } from '@/common/utils/icon'
import Modal from '@/components/modal'
import { useTheme } from '@/context/theme.context'
import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState, useTransition } from 'react'
import { FaImage, FaUpload } from 'react-icons/fa'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { v4 as uuidv4 } from 'uuid'
import type { Bookmark, BookmarkType } from '../types/bookmark.types'
import { AdvancedModal } from './advanced.modal'

interface AddBookmarkModalProps {
	isOpen: boolean
	onClose: () => void
	onAdd: (bookmark: Bookmark) => void
	parentId: string | null
}

export function AddBookmarkModal({
	isOpen,
	onClose,
	onAdd,
	parentId = null,
}: AddBookmarkModalProps) {
	const { theme } = useTheme()
	const [type, setType] = useState<BookmarkType>('BOOKMARK')
	const [iconSource, setIconSource] = useState<'auto' | 'upload' | 'url'>('auto')
	const [showAdvanced, setShowAdvanced] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [isDragging, setIsDragging] = useState(false)
	const [iconLoadError, setIconLoadError] = useState(false)
	const [isPending, startTransition] = useTransition()

	const [formData, setFormData] = useState({
		title: '',
		url: '',
		icon: '',
		customImage: '',
		customBackground: '',
		customTextColor: '',
		emoji: '',
	})

	const getInputStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-white border border-gray-300 text-gray-800'
			case 'dark':
				return 'bg-neutral-800 border border-neutral-700 text-white'
			default: // glass
				return 'bg-[#1E1E1E] border border-[#333] text-white'
		}
	}

	const getIconPreviewStyle = () => {
		switch (theme) {
			case 'light':
				return 'border-gray-300 hover:bg-gray-100'
			case 'dark':
				return 'border-gray-700 hover:bg-gray-700/50'
			default: // glass
				return 'border-white/10 hover:bg-neutral-800/50'
		}
	}

	const updateFormData = (key: string, value: string) => {
		setFormData((prev) => ({ ...prev, [key]: value }))
	}

	const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newUrl = e.target.value
		updateFormData('url', newUrl)

		if (iconSource === 'auto') {
			setIconLoadError(false)
			updateFormData('icon', getFaviconFromUrl(newUrl))
		}
	}

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

	const handleAdd = (e: React.FormEvent) => {
		e.preventDefault()

		startTransition(() => {
			if (!formData.title.trim()) return

			let iconUrl: undefined | string = undefined
			const id = uuidv4()
			if (
				type === 'BOOKMARK' &&
				iconSource === 'auto' &&
				formData.icon &&
				!formData.customImage
			) {
				iconUrl = getFaviconFromUrl(formData.url)
			}

			const baseBookmark = {
				id,
				title: formData.title.trim(),
				type,
				isLocal: true,
				pinned: false,
				parentId,
				customImage: formData.customImage,
				customBackground: formData.customBackground || undefined,
				customTextColor: formData.customTextColor || undefined,
				emoji: formData.emoji || undefined,
			}

			if (type === 'FOLDER') {
				//@ts-ignore
				onAdd({ ...baseBookmark, onlineId: null } as Bookmark)
			} else {
				let newUrl = formData.url
				if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
					newUrl = `https://${newUrl}`
				}

				onAdd({
					...baseBookmark,
					type: 'BOOKMARK',
					url: newUrl.trim(),
					icon: iconUrl,
					onlineId: null,
				} as Bookmark)
			}

			resetForm()
			onClose()
		})
	}

	const resetForm = () => {
		setFormData({
			title: '',
			url: '',
			icon: '',
			customImage: '',
			customBackground: '',
			customTextColor: '',
			emoji: '',
		})
		setType('BOOKMARK')
		setIconSource('auto')
		setShowAdvanced(false)
	}

	const renderIconPreview = () => {
		const handlePreviewClick = () => fileInputRef.current?.click()
		const handleRemoveCustomImage = (e: React.MouseEvent) => {
			e.stopPropagation()
			updateFormData('customImage', '')
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
					isDragging ? 'border-blue-400 bg-blue-50/10' : getIconPreviewStyle()
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

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="md"
			title={`✨ ${type === 'FOLDER' ? 'پوشه جدید' : 'بوکمارک جدید'}`}
			direction="rtl"
			closeOnBackdropClick={false}
			className="!overflow-y-hidden"
		>
			<form onSubmit={handleAdd} className="flex flex-col gap-2 p-2 overflow-y-auto h-96">
				<div className="flex gap-2 mb-2">
					<TypeSelector type={type} setType={setType} theme={theme} />
				</div>

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
				/>

				<motion.input
					type="text"
					name="title"
					placeholder={type === 'FOLDER' ? 'نام پوشه' : 'عنوان بوکمارک'}
					value={formData.title}
					onChange={(e) => updateFormData('title', e.target.value)}
					className={`w-full px-4 py-3 text-right rounded-lg ${getInputStyle()}`}
					required
				/>

				<div className="relative h-[54px]">
					<AnimatePresence mode="popLayout">
						{type === 'BOOKMARK' && (
							<motion.input
								initial={{ opacity: 0, y: -10 }}
								animate={{
									opacity: 1,
									y: 0,
									transition: {
										type: 'spring',
										stiffness: 500,
										damping: 30,
									},
								}}
								exit={{
									opacity: 0,
									y: 10,
									transition: {
										duration: 0.15,
									},
								}}
								type="text"
								name="url"
								placeholder="آدرس لینک"
								value={formData.url}
								onChange={handleUrlChange}
								className={`w-full px-4 py-3 text-right absolute rounded-lg ${getInputStyle()}`}
								required={type === 'BOOKMARK'}
							/>
						)}
					</AnimatePresence>
				</div>

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

				<AdvancedModal
					bookmark={{
						customBackground: formData.customBackground,
						customTextColor: formData.customTextColor,
						emoji: formData.emoji,
						type,
						title: formData.title,
						url: formData.url,
					}}
					setCustomBackground={(value) => updateFormData('customBackground', value)}
					setCustomTextColor={(value) => updateFormData('customTextColor', value)}
					setEmoji={(value) => updateFormData('emoji', value)}
					isOpen={showAdvanced}
					onClose={() => setShowAdvanced(false)}
					title={'تنظیمات پیشرفته'}
				/>

				<div className="flex justify-between mt-4">
					<button
						type="button"
						onClick={onClose}
						className={`px-4 py-2 cursor-pointer rounded-lg ${getButtonStyle(theme, false)}`}
					>
						لغو
					</button>
					<button
						type="submit"
						className={`px-4 py-2 cursor-pointer rounded-lg ${getButtonStyle(theme, true)}`}
						disabled={
							!formData.title.trim() ||
							(type === 'BOOKMARK' && !formData.url.trim()) ||
							isPending
						}
					>
						{isPending ? 'در حال افزودن...' : 'افزودن'}
					</button>
				</div>
			</form>
		</Modal>
	)
}

function getButtonStyle(theme = 'glass', primary = false) {
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

function TypeSelector({
	type,
	setType,
	theme = 'glass',
}: {
	type: BookmarkType
	setType: (type: BookmarkType) => void
	theme?: string
}) {
	const getActiveStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-blue-500 text-white'
			case 'dark':
				return 'bg-blue-600 text-white'
			default:
				return 'bg-blue-500/80 text-white'
		}
	}

	const getInactiveStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-200 text-gray-700'
			case 'dark':
				return 'bg-neutral-700 text-gray-300'
			default:
				return 'bg-neutral-800 text-gray-400'
		}
	}

	return (
		<>
			<button
				onClick={() => setType('BOOKMARK')}
				className={`flex-1 py-2 cursor-pointer rounded-lg transition-colors ${
					type === 'BOOKMARK' ? getActiveStyle() : getInactiveStyle()
				}`}
			>
				بوکمارک
			</button>
			<button
				onClick={() => setType('FOLDER')}
				className={`flex-1 py-2 cursor-pointer rounded-lg transition-colors ${
					type === 'FOLDER' ? getActiveStyle() : getInactiveStyle()
				}`}
			>
				پوشه
			</button>
		</>
	)
}
