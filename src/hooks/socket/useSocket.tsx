import { useCallback, useEffect, useRef, useState } from 'react'

type SocketEventCallback = (data: any) => void

interface UseSocketReturn {
	isConnected: boolean
	socketId: string | null
	emit: (event: string, data: any) => void
	on: (event: string, callback: SocketEventCallback) => void
	off: (event: string, callback?: SocketEventCallback) => void
	connect: () => void
	disconnect: () => void
}

/**
 * Hook for using Socket.IO in React components
 *
 * This hook provides an interface to interact with the Socket.IO connection
 * managed by the background script. It does not create a new connection but
 * communicates with the existing one through the browser's message passing.
 *
 * @returns {UseSocketReturn} Socket interface
 */
export const useSocket = (): UseSocketReturn => {
	const [isConnected, setIsConnected] = useState<boolean>(false)
	const [socketId, setSocketId] = useState<string | null>(null)
	const eventCallbacksRef = useRef<Record<string, SocketEventCallback[]>>({})

	// Check connection status on initialization
	useEffect(() => {
		// Ask the background script about the current socket status
		browser.runtime
			.sendMessage({ type: 'SOCKET_STATUS_REQUEST' })
			.then((response) => {
				if (response) {
					setIsConnected(response.isConnected || false)
					setSocketId(response.socketId || null)
				}
			})
			.catch(() => {
				// If messaging fails, we assume not connected
				setIsConnected(false)
				setSocketId(null)
			})
	}, [])

	// Set up message listener
	useEffect(() => {
		const handleMessage = (message: any) => {
			if (message.type === 'SOCKET_CONNECTED') {
				setIsConnected(true)
				setSocketId(message.socketId)
			} else if (message.type === 'SOCKET_DISCONNECTED') {
				setIsConnected(false)
				setSocketId(null)
			} else if (message.type === 'SOCKET_ERROR') {
				console.error('Socket error:', message.error)
			} else if (
				message.type === 'SOCKET_MESSAGE' ||
				message.type === 'SOCKET_NOTIFICATION'
			) {
				// Handle custom messages
				// Trigger registered callbacks
				const callbacks = eventCallbacksRef.current[message.data.event] || []
				callbacks.forEach((callback) => callback(message.data.payload))
			}

			return true
		}

		browser.runtime.onMessage.addListener(handleMessage)

		return () => {
			browser.runtime.onMessage.removeListener(handleMessage)
		}
	}, [])

	// Register event listener
	const on = useCallback((event: string, callback: SocketEventCallback) => {
		if (!eventCallbacksRef.current[event]) {
			eventCallbacksRef.current[event] = []
		}

		eventCallbacksRef.current[event].push(callback)
	}, [])

	// Remove event listener
	const off = useCallback((event: string, callback?: SocketEventCallback) => {
		if (!eventCallbacksRef.current[event]) return

		if (callback) {
			eventCallbacksRef.current[event] = eventCallbacksRef.current[event].filter(
				(cb) => cb !== callback
			)
		} else {
			delete eventCallbacksRef.current[event]
		}
	}, [])

	// Emit an event
	const emit = useCallback((event: string, data: any) => {
		browser.runtime.sendMessage({
			type: 'SOCKET_EMIT',
			event,
			data,
		})
	}, [])

	// Connect to socket
	const connect = useCallback(() => {
		browser.runtime.sendMessage({ type: 'SOCKET_CONNECT' })
	}, [])

	// Disconnect from socket
	const disconnect = useCallback(() => {
		browser.runtime.sendMessage({ type: 'SOCKET_DISCONNECT' })
	}, [])

	return {
		isConnected,
		socketId,
		emit,
		on,
		off,
		connect,
		disconnect,
	}
}

/**
 * Hook for subscribing to a specific Socket.IO event
 *
 * @param {string} event - The event name to subscribe to
 * @param {SocketEventCallback} callback - The callback function to execute when the event is received
 * @returns {boolean} Whether the socket is connected
 */
export const useSocketEvent = (event: string, callback: SocketEventCallback): boolean => {
	const { isConnected, on, off } = useSocket()

	useEffect(() => {
		on(event, callback)

		return () => {
			off(event, callback)
		}
	}, [event, callback, on, off])

	return isConnected
}

export default useSocket
