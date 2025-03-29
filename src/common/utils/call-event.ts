export enum EventName {
	startSync = 'startSync',
}
export function callEvent<T>(eventName: EventName, data?: T) {
	const event = new CustomEvent(eventName, { detail: data })
	window.dispatchEvent(event)
}
