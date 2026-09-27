export const friendsKeys = {
	all: ['friends'] as const,
	list: (status: string, limit?: number) => ['friends', status, limit] as const,
	uncachedList: (status: string, limit?: number) =>
		['friends', status, limit, 'no-cache'] as const,
	activities: ['friends-activities'] as const,
	activityReactions: (id: string) => ['activity-reactions', id] as const,
}
