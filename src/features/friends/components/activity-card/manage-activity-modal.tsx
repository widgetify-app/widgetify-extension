import { useState } from 'react'
import { t } from '@/common/i18n'
import { Button, Modal } from '@/components/ui'
import type { AttachmentReaction } from '@/services/friends/friend-service.hook'
import { ActivityComposer } from './activity-composer'
import { ActivityDetails } from './activity-details'

interface ManageActivityModalProps {
	isOpen: boolean
	onClose: () => void
	avatar: string
	currentActivity: { id: string; content: string } | null
	reactions: AttachmentReaction[]
	templates: string[]
}

export function ManageActivityModal({
	isOpen,
	onClose,
	avatar,
	currentActivity,
	reactions,
	templates,
}: ManageActivityModalProps) {
	const [showRules, setShowRules] = useState(false)

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size="sm"
				title={
					currentActivity
						? t('friends.activity.current')
						: t('friends.activity.newTitle')
				}
			>
				{currentActivity ? (
					<ActivityDetails
						avatar={avatar}
						activity={currentActivity}
						reactions={reactions}
						onDeleted={onClose}
					/>
				) : (
					<ActivityComposer
						avatar={avatar}
						templates={templates}
						onPublished={onClose}
						onShowRules={() => setShowRules(true)}
					/>
				)}
			</Modal>

			<Modal
				isOpen={showRules}
				onClose={() => setShowRules(false)}
				showCloseButton={false}
				className="px-4"
				title={t('friends.activity.rulesTitle')}
			>
				<div className="space-y-3 text-sm leading-relaxed text-fg-muted">
					<p>{t('friends.activity.rule1')}</p>
					<p>{t('friends.activity.rule2')}</p>
					<p>{t('friends.activity.rule3')}</p>
					<p>{t('friends.activity.rule4')}</p>
					<p>{t('friends.activity.rule5')}</p>
				</div>

				<Button
					size="sm"
					type="button"
					fullWidth
					rounded="2xl"
					className="h-12 mt-5 text-base font-bold shadow-sm"
					onClick={() => setShowRules(false)}
				>
					{t('friends.activity.gotIt')}
				</Button>
			</Modal>
		</>
	)
}
