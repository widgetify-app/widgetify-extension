import { getFaviconFromUrl } from '@/common/utils/icon'
import { Button } from '@/components/button/button'
import Modal from '@/components/modal'
import { TextInput } from '@/components/text-input'
import { useEffect, useState } from 'react'
import type { Bookmark } from '../../types/bookmark.types'
import {
	IconSourceSelector,
	type IconSourceType,
	ShowAdvancedButton,
	useBookmarkIcon,
} from '../shared'
import { AdvancedModal } from './advanced.modal'
import { useIsMutating } from '@tanstack/react-query'

interface EditBookmarkModalProps {
	isOpen: boolean
	onClose: () => void
	onSave: (out: BookmarkUpdateFormFields) => void
	bookmark: Bookmark
}

export interface BookmarkUpdateFormFields {
	readonly id?: string
	readonly onlineId?: string
	title: string
	url: string | null
	customImage: File | null
	customBackground: string | null
	customTextColor: string | null
	sticker: string | null
	icon: File | null
}

const empty: BookmarkUpdateFormFields = {
	id: undefined,
	onlineId: undefined,
	title: '',
	url: '',
	customImage: null,
	customBackground: '',
	customTextColor: '',
	sticker: '',
	icon: null,
}
type UpdateBookmarkUpdateFormData = <K extends keyof BookmarkUpdateFormFields>(
	key: K,
	value: BookmarkUpdateFormFields[K]
) => void

export function EditBookmarkModal({
	isOpen,
	onClose,
	onSave,
	bookmark,
}: EditBookmarkModalProps) {
	const [formData, setFormData] = useState<BookmarkUpdateFormFields>(
		structuredClone(empty)
	)

	const isUpdating = useIsMutating({ mutationKey: ['updateBookmark'] }) > 0

	const [iconSource, setIconSource] = useState<IconSourceType>('auto')
	const [showAdvanced, setShowAdvanced] = useState(false)
	const [icon, setIcon] = useState<string | null | File>(null)

	const type = bookmark?.type

	const { fileInputRef, renderIconPreview, handleImageUpload } = useBookmarkIcon()

	const updateFormData: UpdateBookmarkUpdateFormData = (key, value) => {
		if (key === 'icon') {
			setIcon(value || null)
		}
		setFormData((prev) => ({ ...prev, [key]: value }))
	}

	const handleSave = () => {
		if (!formData.title?.trim() || !bookmark) return

		onSave({
			title: formData.title.trim(),
			url: formData.url || null,
			customBackground: formData.customBackground || null,
			customImage: formData.customImage,
			customTextColor: formData.customTextColor || null,
			sticker: formData.sticker || null,
			icon: formData.icon,
			id: bookmark.id,
			onlineId: bookmark.onlineId || undefined,
		})
		// onClose()
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
		if (bookmark) {
			setFormData({
				onlineId: bookmark.onlineId || undefined,
				id: bookmark.id,
				title: bookmark.title,
				customBackground: bookmark.customBackground,
				customImage: null,
				customTextColor: bookmark.customTextColor,
				icon: null,
				sticker: bookmark.sticker,
				url: bookmark.url,
			})
			setIconSource(bookmark.icon ? 'upload' : 'auto')
			if (bookmark.icon) {
				setIcon(bookmark.icon)
			} else if (bookmark.type === 'BOOKMARK' && bookmark.url) {
				setIcon(getFaviconFromUrl(bookmark.url))
			}
		}
	}, [bookmark])

	if (!bookmark) return null

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="md"
			title={`ویرایش ${type === 'FOLDER' ? 'پوشه' : 'بوکمارک'}`}
			direction="rtl"
			className="!overflow-y-hidden"
			closeOnBackdropClick={false}
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
							icon,
							type === 'FOLDER' ? 'upload' : iconSource,
							setIconSource,
							(value) => updateFormData('icon', value)
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
						placeholder={type === 'FOLDER' ? 'نام پوشه' : 'عنوان بوکمارک'}
						value={formData.title}
						onChange={(value) => updateFormData('title', value)}
						className={
							'w-full px-4 py-3 text-right rounded-lg transition-all duration-200'
						}
					/>

					<div className="relative h-[50px]">
						{type === 'BOOKMARK' && (
							<TextInput
								name="url"
								type="text"
								placeholder="آدرس لینک"
								value={formData.url || ''}
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
							disabled={isUpdating}
							className={
								'btn btn-circle !bg-base-300 hover:!bg-error/10 text-muted hover:!text-error px-10 border-none shadow-none !rounded-2xl transition-colors duration-300 ease-in-out'
							}
						>
							لغو
						</Button>
						<Button
							onClick={handleSave}
							disabled={
								!formData.title?.trim() ||
								(type === 'BOOKMARK' && !formData.url?.trim()) ||
								isUpdating
							}
							size="md"
							isPrimary={true}
							loading={isUpdating}
							className={
								'btn btn-circle !w-fit px-8 border-none shadow-none text-secondary !rounded-2xl transition-colors duration-300 ease-in-out'
							}
						>
							ذخیره
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
