import type { JSX } from 'react'

export interface Platform {
	id: string
	name: string
	icon: JSX.Element
	connected: boolean
	description: string
	bgColor: string
	isActive: boolean
	isLoading?: boolean
	features?: string[]
	permissions?: string[]
	isOptionalPermissions?: boolean
}
