import type { AttachmentReaction } from '@/services/hooks/friends/friendService.hook'

export function GetContentFromReactions(
	reactionId: string | undefined,
	reactions: AttachmentReaction[]
) {
	if (!reactionId) return null

	return reactions.find((f) => f.id === reactionId)
}

export function RenderReactionContent(content: string) {
	if (content.startsWith('https://'))
		return <img src={content} className="object-center w-4 h-4" />

	return content
}
