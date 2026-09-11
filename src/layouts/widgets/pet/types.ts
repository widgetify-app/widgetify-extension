import type React from 'react'

export enum PetSpeed {
	SLOW = 1,
	NORMAL = 1.8,
	FAST = 2.5,
	VERY_FAST = 3.5,
}

export enum PetBehavior {
	ROAMING = 'roaming',
	RESTING = 'resting',
	CLIMBING = 'climbing',
	CHASING = 'chasing',
}

export interface Position {
	x: number
	y: number
}

export interface CollectibleItem {
	id: number
	x: number
	y: number
	collected: boolean
	dropping: boolean
}

export interface PetAnimations {
	idle: string
	walk: string
	run: string
	swipe?: string
	climb?: string
	sit?: string
	stand?: string
}

export interface PetDimensions {
	size: number
	width: number
	walkSpeed: number
	runSpeed: number
	climbSpeed: number
	maxHeight: number
}

export interface PetDurations {
	walk: { min: number; max: number }
	run: { min: number; max: number }
	rest: { min: number; max: number }
	climb: { min: number; max: number }
}

export interface PetAssets {
	collectibleIcon: React.ReactNode
	collectibleSize: number
	collectibleFallSpeed: number
}
