import { useState } from 'react'
import Analytics from '@/analytics'
import { showToast } from '@/common/toast'
import { Button, Modal } from '@/components/ui'
import { useRemoveActivity, useSetActivity } from '@/services/user/user-service.hook'
import { translateError } from '@/common/utils/translate-error'
import { playAlarm } from '@/common/utils/play-alarm'
import {
	type AttachmentReaction,
	useGetActivityReactions,
} from '@/services/friends/friend-service.hook'
import { MakeSkeletonFriendItem } from '../friend-item-skeleton'
import { GetContentFromReactions, RenderReactionContent } from './activity-reaction'
import { AvatarComponent } from '@/components/ui'
import { callEvent } from '@/common/utils/call-event'
import { Chip } from '@/components/ui'
import { SelectBox } from '@/components/ui'
import { Tooltip } from '@/components/ui'
import { Icon } from '@/icons'

interface ManageActivityBottomSheetProps {
	isOpen: boolean
	onClose: () => void
	currentActivity: {
		id: string
		content: string
	} | null
	reactions: AttachmentReaction[]
	templates: string[]
}

const MAX_ACTIVITY_LENGTH = 40

export function ManageActivityBottomSheet({
	onClose,
	currentActivity,
	reactions,
	templates,
}: ManageActivityBottomSheetProps) {
	const [activity, setActivity] = useState('')
	const [time, setTime] = useState<24 | 4 | 1>(24)
	const [showModal, setShowModal] = useState(false)
	const { mutateAsync, isPending: isSubmitting } = useSetActivity()
	const { mutateAsync: removeAsync, isPending: isRemoving } = useRemoveActivity()
	const { data: fetchedReactions, isPending } = useGetActivityReactions(
		currentActivity?.id || '',
		!!currentActivity
	)

	const handleSave = async () => {
		if (!activity.trim()) {
			showToast('اول یه چیزی بنویس', 'error')
			return
		}

		if (currentActivity) {
			showToast('فعلاً نمی‌تونی نوشته‌ی جدید بذاری', 'error')
			return
		}

		try {
			await mutateAsync({ content: activity, time })
			Analytics.event('friends_activity_posted')
			playAlarm('done_todo')
			setActivity('')
			onClose()
			callEvent('closeAllDropdowns')
		} catch (er) {
			const translatedError = translateError(er)
			if (typeof translatedError === 'string') {
				return showToast(translatedError, 'error')
			}

			const key = Object.keys(translatedError)[0]
			return showToast(translatedError[key], 'error')
		}
	}

	const handleDelete = async () => {
		if (!currentActivity) return

		try {
			await removeAsync({ id: currentActivity.id })

			showToast('نوشته‌ت حذف شد', 'success')
			setActivity('')
			onClose()
		} catch {
			showToast('نتونستیم نوشته رو حذف کنیم، دوباره امتحان کن', 'error')
		}
	}

	if (currentActivity) {
		return (
			<div className="flex flex-col gap-3 p-2 border min-w-96 max-w-96 bg-surface-2 border-surface-3 rounded-2xl">
				<div className="flex flex-col gap-1">
					<div className="flex flex-row items-center justify-between">
						<p className="text-sm font-bold text-fg-muted">نوشته‌ی فعلیت</p>
						<Button
							type="button"
							onClick={handleDelete}
							disabled={isRemoving}
							size="xs"
							color="danger"
							rounded="xl"
							className="shadow-sm left-1 group shadow-danger-fill-2"
							loading={isRemoving}
						>
							<div className="flex items-center justify-center gap-1 text-on-danger leading-1">
								<Icon name="trash" />
								حذف نوشته
							</div>
						</Button>
					</div>

					<div className="p-4 border border-dashed rounded-xl bg-surface-2 border-surface-3">
						<p className="text-fg text-shadow-2xs wrap-break-word" dir="auto">
							{currentActivity.content}
						</p>
					</div>
				</div>

				<div className="flex flex-col">
					<p className="mb-2 text-sm font-bold text-fg-muted">
						واکنش‌ها ({fetchedReactions?.reactions?.length || 0})
					</p>
					{isPending ? (
						<div className="flex flex-col gap-1 h-28">
							{MakeSkeletonFriendItem(3)}
						</div>
					) : fetchedReactions?.reactions.length ? (
						<div className="flex flex-wrap items-start justify-start gap-1 pb-4 pl-1 overflow-y-auto h-28">
							{fetchedReactions.reactions.map((r, i) => (
								<div
									className="flex items-center h-10 gap-1.5 px-2 border rounded-full w-fit bg-surface-2 border-surface-3"
									key={i}
								>
									<div className="overflow-hidden rounded-full ring-2 ring-surface-3">
										<AvatarComponent
											url={r.avatar}
											placeholder={r.name}
											size="xs"
										/>
									</div>

									<div className="flex-1 min-w-0">
										<div className="text-xs font-medium truncate text-fg">
											{r.name}
										</div>
										<div className="text-xs truncate text-fg-muted">
											{r.username}@
										</div>
									</div>

									<div className="flex items-center gap-2 mr-1 shrink-0">
										<span className="w-5 h-5 text-sm leading-6 rounded-full shadow-sm bg-brand-fill">
											{RenderReactionContent(
												GetContentFromReactions(
													r.reaction,
													reactions
												)?.content || ''
											)}
										</span>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="flex items-start justify-center h-24 text-fg-muted">
							فعلا واکنشی نداری 😶‍🌫️
						</div>
					)}
				</div>
			</div>
		)
	}

	return (
		<>
			<div className="flex flex-col gap-2 p-2 border min-w-96 max-w-96 bg-surface-2 border-surface-3 rounded-2xl">
				<div className="space-y-1">
					<div className="space-y-1">
						<div className="flex justify-between">
							<p className="flex text-sm font-medium text-fg">
								متن نوشته
								<Tooltip content="نوشته‌ت رو فقط دوستات می‌بینن">
									<Icon
										name="info"
										className="mr-1 text-fg-muted mt-0.5"
									/>
								</Tooltip>
							</p>
							<SelectBox
								options={[
									{
										label: '1 روز نمایش بده',
										value: '24',
									},
									{
										label: '4 ساعت نمایش بده',
										value: '4',
									},
									{
										label: '1 ساعت نمایش بده',
										value: '1',
									},
								]}
								optionalText="نمایش"
								value={String(time)}
								className="w-32! border-none"
								onChange={(val) =>
									setTime((Number(val) as 24 | 4 | 1) || 24)
								}
							></SelectBox>
						</div>
						<textarea
							id="activity-text"
							name="activity-text"
							value={activity}
							onChange={(e) =>
								setActivity(e.target.value.slice(0, MAX_ACTIVITY_LENGTH))
							}
							placeholder="یه چیزی بگو..."
							className="w-full h-16 px-4 py-2 mt-1 text-base leading-relaxed transition-ui border-none outline-none resize-none max-h-16 bg-surface-2 text-fg-muted rounded-2xl placeholder:font-light focus:placeholder:text-fg-ghost"
							rows={4}
							dir={!activity ? 'rtl' : 'auto'}
							maxLength={MAX_ACTIVITY_LENGTH}
						/>
					</div>

					{templates.length ? (
						<div className="grid grid-flow-col p-2 overflow-x-auto overflow-y-hidden text-center h-14 auto-cols-max rounded-2xl">
							{templates.map((text) => (
								<Chip
									onClick={() => setActivity(text)}
									selected={false}
									key={''}
									className="h-fit"
									dir="auto"
								>
									{text}
								</Chip>
							))}
						</div>
					) : null}

					<Button
						type="submit"
						onClick={handleSave}
						disabled={isSubmitting || !activity.trim()}
						size="sm"
						className="w-full mt-1"
						color={'brand'}
						rounded={'2xl'}
						loading={isSubmitting}
					>
						انتشار نوشته
					</Button>
				</div>
			</div>

			<Modal
				isOpen={showModal}
				onClose={() => setShowModal(false)}
				showCloseButton={false}
				className="px-4"
				title="قوانین"
			>
				<div className="space-y-3 text-sm leading-relaxed text-fg-muted">
					<p>متن توهین‌آمیز، سیاسی یا دینی ننویس.</p>

					<p>لینک یا محتوای بیرونی نذار.</p>

					<p>
						اگه نوشته‌ای ازت گزارش بشه و نامناسب باشه، ممکنه حسابت محدود بشه.
					</p>

					<p>کمکمون کن اینجا جای امن و دوستانه‌ای بمونه.</p>

					<p>هر روز فقط یه نوشته‌ی جدید می‌تونی بذاری.</p>
				</div>

				<Button
					size="sm"
					type="button"
					fullWidth
					rounded="2xl"
					className="h-12 mt-5 text-base font-bold shadow-sm"
					onClick={() => setShowModal(false)}
				>
					متوجه شدم
				</Button>
			</Modal>
		</>
	)
}
