import { useState, useTransition } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { getFaviconFromUrl } from '@/common/utils/icon'
import { Button } from '@/components/button/button'
import Modal from '@/components/modal'
import { TextInput } from '@/components/text-input'
import type { Bookmark, BookmarkType } from '../../types/bookmark.types'
import { BookmarkSuggestions } from '../bookmark-suggestions'
import {
	type BookmarkFormData,
	IconSourceSelector,
	type IconSourceType,
	ShowAdvancedButton,
	TypeSelector,
	useBookmarkIcon,
} from '../shared'
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
	const [type, setType] = useState<BookmarkType>('BOOKMARK')
	const [iconSource, setIconSource] = useState<IconSourceType>('auto')
	const [showAdvanced, setShowAdvanced] = useState(false)
	const [isPending, startTransition] = useTransition()

	const [formData, setFormData] = useState<BookmarkFormData>({
		title: '',
		url: '',
		icon: '',
		customImage: '',
		customBackground: '',
		customTextColor: '',
		sticker: '',
	})

	const { fileInputRef, setIconLoadError, renderIconPreview, handleImageUpload } =
		useBookmarkIcon()

	const updateFormData = (key: string, value: string) => {
		setFormData((prev) => ({ ...prev, [key]: value }))
	}

	const handleUrlChange = (value: string) => {
		const newUrl = value.trim()
		updateFormData('url', newUrl)

		if (iconSource === 'auto') {
			setIconLoadError(false)
			updateFormData('icon', getFaviconFromUrl(newUrl))
		}

		if (formData.title.trim() === '' && newUrl !== '') {
			let hostName = ''
			try {
				hostName = new URL(newUrl).hostname
				if (hostName && hostName.split('.').length > 2) {
					hostName = hostName.split('.')[1]
				}
			} catch {
				hostName = newUrl
			}

			updateFormData('title', hostName)
		}
	}

	const handleAdd = (e: React.FormEvent) => {
		e.preventDefault()

		startTransition(() => {
			if (!formData.title.trim()) return

			let iconUrl: undefined | string
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
				sticker: formData.sticker || undefined,
			}

			if (type === 'FOLDER') {
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

			onCloseHandler()
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
			sticker: '',
		})
		setType('BOOKMARK')
		setIconSource('auto')
		setShowAdvanced(false)
	}

	const onCloseHandler = () => {
		resetForm()
		onClose()
	}

	const handleSuggestionSelect = (suggestion: {
		title: string
		url: string
		icon: string | null
	}) => {
		updateFormData('title', suggestion.title)
		updateFormData('url', suggestion.url)

		if (iconSource === 'auto') {
			setIconLoadError(false)
			const iconUrl = suggestion.icon || getFaviconFromUrl(suggestion.url)
			updateFormData('icon', iconUrl)
		}
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

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => onCloseHandler()}
			size="md"
			title={`${type === 'FOLDER' ? 'پوشه جدید' : 'بوکمارک جدید'}`}
			direction="rtl"
			className="!overflow-y-hidden"
			closeOnBackdropClick={false}
		>
			<form
				onSubmit={handleAdd}
				className="flex flex-col justify-between gap-2 overflow-y-auto h-[24rem]"
			>
				<div className="mt-1 overflow-hidden">
					<div className="flex h-8 gap-2 mb-2">
						<TypeSelector type={type} setType={setType} />
					</div>

					<div className="py-2 overflow-auto">
						{' '}
						<div
							className={`mb-0.5 flex flex-row  w-full items-center gap-y-2.5
								${type === 'FOLDER' ? 'items-start justify-center' : 'items-center justify-between'}
							`}
						>
							{type === 'BOOKMARK' && (
								<IconSourceSelector
									iconSource={iconSource}
									setIconSource={setIconSource}
								/>
							)}
							{renderIconPreview(
								formData,
								type === 'FOLDER' ? 'upload' : iconSource,
								setIconSource,
								updateFormData,
								type
							)}
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
							onChange={(v) => updateFormData('title', v)}
							className={
								'mt-2 w-full px-4 py-3 text-right rounded-lg transition-all duration-200 '
							}
						/>
						<div className="relative h-[50px]">
							{type === 'BOOKMARK' && (
								<TextInput
									type="text"
									name="url"
									placeholder="آدرس لینک"
									value={formData.url}
									onChange={(v) => handleUrlChange(v)}
									className={
										'mt-2 w-full px-4 py-3 text-right absolute rounded-lg transition-all duration-300'
									}
								/>
							)}
						</div>
						{type === 'BOOKMARK' && (
							<BookmarkSuggestions onSelect={handleSuggestionSelect} />
						)}
					</div>

					<AdvancedModal
						bookmark={{
							customBackground: formData.customBackground,
							customTextColor: formData.customTextColor,
							sticker: formData.sticker,
							type,
							title: formData.title,
							url: formData.url,
						}}
						isOpen={showAdvanced}
						onClose={handleAdvancedModalClose}
						title={'تنظیمات پیشرفته'}
					/>
				</div>

				<div className="flex justify-between h-10 gap-x-4">
					<ShowAdvancedButton
						showAdvanced={showAdvanced}
						setShowAdvanced={setShowAdvanced}
					/>

					<div className="flex items-center gap-x-2">
						<Button
							onClick={onCloseHandler}
							size="md"
							className={
								'btn btn-circle !bg-base-300 hover:!bg-error/10 text-muted hover:!text-error px-10 border-none shadow-none rounded-xl transition-colors duration-300 ease-in-out'
							}
						>
							لغو
						</Button>
						<Button
							type="submit"
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
			</form>
		</Modal>
	)
}
