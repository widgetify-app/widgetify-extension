import type { AttachmentReaction } from '@/services/friends/friend-service.hook'

export function GetContentFromReactions(
	reactionId: string | undefined,
	reactions: AttachmentReaction[]
) {
	if (!reactionId) return null

	return reactions.find((f) => f.id === reactionId)
}

export function RenderReactionContent(content: string, imageSize = 'size-4') {
	if (content.startsWith('https://'))
		return <img src={content} alt="" className={`object-center ${imageSize}`} />

	return content
}
