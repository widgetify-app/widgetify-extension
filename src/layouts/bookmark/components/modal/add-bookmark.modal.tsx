import { useState, useEffect } from 'react'
import { Button } from '@/components/button/button'
import Modal from '@/components/modal'
import { TextInput } from '@/components/text-input'
import type { BookmarkType } from '../../types/bookmark.types'
import { BookmarkSuggestions } from '../bookmark-suggestions'
import {
	IconSourceSelector,
	type IconSourceType,
	ShowAdvancedButton,
	TypeSelector,
	useBookmarkIcon,
} from '../shared'
import { AdvancedModal } from './advanced.modal'
import { useIsMutating } from '@tanstack/react-query'

interface AddBookmarkModalProps {
	isOpen: boolean
	onClose: () => void
	onAdd: (bookmark: BookmarkCreateFormFields) => void
	parentId: string | null
	onOpenImportModal?: () => void
}

export interface BookmarkCreateFormFields {
	title: string
	type: BookmarkType
	parentId: string | null
	url: string | null
	customImage: File | null
	customBackground: string | null
	customTextColor: string | null
	sticker: string | null
	icon: File | null
}

const empty: BookmarkCreateFormFields = {
	title: '',
	url: '',
	customImage: null,
	customBackground: '',
	parentId: '',
	type: 'BOOKMARK',
	customTextColor: '',
	sticker: '',
	icon: null,
}

export type AddBookmarkUpdateFormData = <K extends keyof BookmarkCreateFormFields>(
	key: K,
	value: BookmarkCreateFormFields[K]
) => void

export function AddBookmarkModal({
	isOpen,
	onClose,
	onAdd,
	parentId = null,
	onOpenImportModal,
}: AddBookmarkModalProps) {
	const [type, setType] = useState<BookmarkType>('BOOKMARK')
	const [iconSource, setIconSource] = useState<IconSourceType>('auto')
	const [showAdvanced, setShowAdvanced] = useState(false)

	const isAdding = useIsMutating({ mutationKey: ['addBookmark'] }) > 0

	const [formData, setFormData] = useState<BookmarkCreateFormFields>(
		structuredClone(empty)
	)

	const { fileInputRef, setIconLoadError, renderIconPreview, handleImageUpload } =
		useBookmarkIcon()

	const updateFormData: AddBookmarkUpdateFormData = <
		K extends keyof BookmarkCreateFormFields,
	>(
		key: K,
		value: BookmarkCreateFormFields[K]
	) => {
		setFormData((prev) => ({ ...prev, [key]: value }))
	}

	const handleUrlChange = (value: string) => {
		const newUrl = value.trim()
		updateFormData('url', newUrl)

		if (iconSource === 'auto') {
			setIconLoadError(false)
			updateFormData('icon', null)
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

		if (!formData.title.trim()) return

		let newUrl = formData.url
		if (newUrl && !newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
			newUrl = `https://${newUrl}`
		}
		const baseBookmark: BookmarkCreateFormFields = {
			title: formData.title.trim(),
			url: type === 'BOOKMARK' && newUrl ? newUrl.trim() : null,
			type,
			parentId,
			customImage: formData.customImage,
			customBackground: formData.customBackground || null,
			customTextColor: formData.customTextColor || null,
			sticker: formData.sticker || null,
			icon: formData.icon,
		}

		onAdd(baseBookmark)
	}

	const resetForm = () => {
		setFormData(structuredClone(empty))
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
			updateFormData('icon', null)
		}
	}

	const handleAdvancedModalClose = (
		data: {
			background: string | null
			textColor: string | null
			sticker: string | null
		} | null
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

	useEffect(() => {
		if (isOpen) {
			resetForm()
		}
	}, [isOpen])

	return (
		<>
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

						{/* Import from browser bookmarks button */}
						{type === 'BOOKMARK' && onOpenImportModal && (
							<div className="mb-2">
								<button
									type="button"
									onClick={() => {
										onCloseHandler()
										onOpenImportModal()
									}}
									className="w-full px-4 py-2 text-sm font-medium text-right transition-colors duration-200 bg-base-300 hover:bg-base-300/70 border border-base-300/40 rounded-xl text-content active:scale-95"
								>
									📚 وارد کردن از بوکمارک‌های مرورگر
								</button>
							</div>
						)}

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
									formData.icon,
									type === 'FOLDER' ? 'upload' : iconSource,
									setIconSource,
									(value) => updateFormData('icon', value)
								)}
							</div>
							<input
								type="file"
								ref={fileInputRef}
								className="hidden"
								accept="image/*"
								onChange={(e) =>
									handleImageUpload(
										e,
										(file) => updateFormData('icon', file),
										setIconSource
									)
								}
							/>
							<TextInput
								type="text"
								name="title"
								placeholder={
									type === 'FOLDER' ? 'نام پوشه' : 'عنوان بوکمارک'
								}
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
										value={formData.url || ''}
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
							bookmark={formData}
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
									isAdding
								}
								size="md"
								isPrimary={true}
								loading={isAdding}
								className={
									'btn btn-circle !w-fit px-8 border-none shadow-none text-secondary rounded-xl transition-colors duration-300 ease-in-out'
								}
							>
								ذخیره
							</Button>
						</div>
					</div>
				</form>
			</Modal>
		</>
	)
}
