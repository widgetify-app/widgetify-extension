import { useState } from 'react'
import { Button } from '@/components/button/button'
import { showToast } from '@/common/toast'
import Modal from '@/components/modal'
import { useRemoveActivity, useSetActivity } from '@/services/hooks/user/userService.hook'
import { translateError } from '@/utils/translate-error'
import { playAlarm } from '@/common/playAlarm'
import {
	type AttachmentReaction,
	useGetActivityReactions,
} from '@/services/hooks/friends/friendService.hook'
import { MakeSkeletonFriendItem } from '../friend-item/friend-item.skeleton'
import { GetContentFromReactions, RenderReactionContent } from './activity-reaction'
import { AvatarComponent } from '@/components/avatar.component'
import { callEvent } from '@/common/utils/call-event'
import { Chip } from '@/components/chip.component'
import { SelectBox } from '@/components/selectbox/selectbox'
import Tooltip from '@/components/toolTip'
import { Icon } from '@/src/icons'

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
// const ACTIVITY_COOLDOWN_HOURS = 24

export function ManageActivityBottomSheet({
	onClose,
	currentActivity,
	reactions,
	templates,
}: ManageActivityBottomSheetProps) {
	const [activity, setActivity] = useState('')
	const [time, setTime] = useState<24 | 4 | 3>(24)
	const [showModal, setShowModal] = useState(false)
	const { mutateAsync, isPending: isSubmitting } = useSetActivity()
	const { mutateAsync: removeAsync, isPending: isRemoving } = useRemoveActivity()
	const { data: fetchedReactions, isPending } = useGetActivityReactions(
		currentActivity?.id || '',
		!!currentActivity
	)

	const handleSave = async () => {
		if (!activity.trim()) {
			showToast('لطفا متنی وارد کنید', 'error')
			return
		}

		if (currentActivity) {
			showToast('شما نمی‌توانید در این زمان نوشته جدید ارسال کنید', 'error')
			return
		}

		try {
			await mutateAsync({ content: activity, time })
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

			showToast('نوشته شما حذف شد', 'success')
			setActivity('')
			onClose()
		} catch {
			showToast('خطا در حذف نوشته', 'error')
		}
	}

	if (currentActivity) {
		return (
			<div className="flex flex-col gap-3 p-2 min-w-96 max-w-96">
				<div className="flex flex-col gap-1">
					<div className="flex flex-row items-center justify-between">
						<p className="text-sm font-bold text-base-content/70">
							نوشته فعلی شما
						</p>
						<Button
							type="button"
							onClick={handleDelete}
							disabled={isRemoving}
							size="xs"
							className="border shadow rounded-xl left-1 group btn btn-error shadow-error/20"
							loading={isRemoving}
						>
							<div className="flex items-center justify-center gap-1 text-error-content leading-1">
								<Icon name="trash" />
								حذف نوشته
							</div>
						</Button>
					</div>

					<div className="p-4 border border-dashed rounded-xl bg-content border-content">
						<p
							className="text-content text-shadow-2xs wrap-break-word"
							dir="auto"
						>
							{currentActivity.content}
						</p>
					</div>
				</div>

				<div className="flex flex-col">
					<p className="mb-2 text-sm font-bold text-base-content/70">
						واکنش ها ({fetchedReactions?.reactions?.length || 0})
					</p>
					{isPending ? (
						<div className="flex flex-col gap-1 h-28">
							{MakeSkeletonFriendItem(3)}
						</div>
					) : fetchedReactions?.reactions.length ? (
						<div className="flex flex-wrap items-start justify-start gap-1 pb-4 pl-1 overflow-y-auto h-28">
							{fetchedReactions.reactions.map((r, i) => (
								<div
									className="flex items-center h-10 gap-1.5 px-2 border rounded-full w-fit bg-content border-content"
									key={i}
								>
									<div className="overflow-hidden rounded-full ring-2 ring-base-300">
										<AvatarComponent
											url={r.avatar}
											placeholder={r.name}
											size="xs"
										/>
									</div>

									<div className="flex-1 min-w-0">
										<div className="text-xs font-medium truncate text-content">
											{r.name}
										</div>
										<div className="text-xs truncate text-base-content/60">
											{r.username}@
										</div>
									</div>

									<div className="flex items-center gap-2 mr-1 shrink-0">
										<span className="w-5 h-5 text-sm leading-6 rounded-full shadow bg-primary/10">
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
						<div className="flex items-start justify-center h-24 text-muted">
							فعلا واکنشی نداری 😶‍🌫️
						</div>
					)}
				</div>
			</div>
		)
	}

	return (
		<>
			<div className="flex flex-col gap-2 p-2 min-w-96 max-w-96">
				<div className="space-y-1">
					<div className="space-y-1">
						<div className="flex justify-between">
							<p className="flex text-sm font-medium text-content">
								متن نوشته
								<Tooltip content="نوشته فقط برای دوستان نمایش داده میشه!">
									<Icon
										name="info"
										className="mr-1 text-muted mt-0.5"
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
								className="w-32!"
								onChange={(val) => setTime((Number(val) as any) || 24)}
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
							className="w-full h-16 px-4 py-2 mt-1 text-base leading-relaxed transition-all border-none outline-none resize-none max-h-16 bg-content text-muted rounded-2xl placeholder:font-light focus:placeholder-base-content/10"
							rows={4}
							dir={!activity ? 'rtl' : 'auto'}
							maxLength={MAX_ACTIVITY_LENGTH}
						/>
					</div>

					{templates.length && (
						<div className="grid grid-flow-col p-2 overflow-x-auto overflow-y-hidden text-center grid-auto-flow-dense h-14 auto-cols-max rounded-2xl">
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
					)}

					<Button
						type="submit"
						onClick={handleSave}
						disabled={isSubmitting || !activity.trim()}
						size="sm"
						className="w-full mt-1 rounded-xl"
						isPrimary
						loading={isSubmitting}
					>
						انتشار نوشته
					</Button>
				</div>
			</div>

			<Modal
				isOpen={showModal}
				onClose={() => setShowModal(false)}
				direction="rtl"
				showCloseButton={false}
				className="px-4"
				title="قوانین"
			>
				<div className="space-y-3 text-sm leading-relaxed text-muted">
					<p>
						از درج هرگونه متن یا محتوای توهین‌آمیز، سیاسی یا دینی خودداری کنید.
					</p>

					<p>از اشتراک‌گذاری لینک‌ها و محتوای خارجی خودداری کنید.</p>

					<p>
						در صورت گزارش محتوای نامناسب، حساب کاربری شما ممکن است محدود شود.
					</p>

					<p>لطفا با رعایت قوانین به ما در حفظ فضای امن و دوستانه کمک کنید.</p>

					<p>در هر روز فقط یک بار امکان انتشار نوشته جدید دارید.</p>
				</div>

				<Button
					size="sm"
					type="button"
					className="h-12 mt-5 text-base font-bold shadow-sm btn-block rounded-2xl"
					onClick={() => setShowModal(false)}
				>
					متوجه شدم
				</Button>
			</Modal>
		</>
	)
}
