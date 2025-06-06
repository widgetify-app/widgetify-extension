import { Button } from '@/components/button/button'
import { SectionPanel } from '@/components/section-panel'
import { TextInput } from '@/components/text-input'
import { useUpdateActivity } from '@/services/hooks/user/userService.hook'
import { translateError } from '@/utils/translate-error'
import { useState } from 'react'
import toast from 'react-hot-toast'

const ACTIVITY_MAX_LENGTH = 40
interface Prop {
	activity: string
}
export function ActivityInput({ activity }: Prop) {
	const [activityText, setActivityText] = useState<string>(activity)
	const { mutate: updateActivity, isPending: isUpdatingActivity } = useUpdateActivity()

	const handleActivityUpdate = () => {
		if (activityText.length > ACTIVITY_MAX_LENGTH) {
			toast.error(
				`وضعیت فعالیت نمی‌تواند بیشتر از ${ACTIVITY_MAX_LENGTH} کاراکتر باشد.`
			)
			return
		}

		updateActivity(
			{ activity: activityText || undefined },
			{
				onSuccess: () => {
					toast.success('وضعیت با موفقیت بروزرسانی شد')
				},
				onError: (error) => {
					const content = translateError(error)
					if (typeof content === 'string') {
						toast.error(content)
					} else {
						toast.error('خطا در بروزرسانی وضعیت. لطفاً دوباره تلاش کنید.')
					}
				},
			}
		)
	}

	return (
		<SectionPanel title="وضعیت فعالیت" size="xs">
			<div className="flex flex-col p-4 space-y-3 transition-colors rounded-lg">
				<p className={'text-xs text-content font-light opacity-80'}>
					وضعیت فعالیت شما به دوستانتان نمایش داده می‌شود. (حداکثر{' '}
					{ACTIVITY_MAX_LENGTH} کاراکتر)
				</p>
				<div className="flex flex-col gap-2">
					<TextInput
						id="activity"
						placeholder="مثال: ⚒️ در حال کار"
						value={activityText}
						onChange={setActivityText}
						disabled={isUpdatingActivity}
						maxLength={ACTIVITY_MAX_LENGTH}
					/>
					<div className="flex items-center justify-between">
						<Button
							onClick={handleActivityUpdate}
							disabled={
								isUpdatingActivity ||
								activityText === activity ||
								activityText.length > ACTIVITY_MAX_LENGTH
							}
							size="md"
							isPrimary={true}
						>
							{isUpdatingActivity ? 'در حال ذخیره...' : 'ذخیره وضعیت'}
						</Button>
					</div>
				</div>
			</div>
		</SectionPanel>
	)
}
