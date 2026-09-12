import type React from 'react'

export enum PetTypes {
	DOG = 'dog',
	CHICKEN = 'chicken',
	CRAB = 'crab',
	FROG = 'frog',
	CAT = 'cat',
}

export type PetSpecies = 'dog' | 'chicken' | 'crab' | 'frog' | 'cat'

export type PetBackgroundId = 'forest' | 'autumn' | 'beach'

export interface PetBackground {
	id: PetBackgroundId
	label: string
	image: string
	groundOffsetPx: number
}

export interface PetHungerState {
	level: number
	lastHungerTick: number | null
}

export interface PetOption {
	name: string
	type: PetSpecies
	hungryState: PetHungerState
}

export interface PetSettings {
	petType: PetTypes | null
	background: PetBackgroundId
	petOptions: Record<PetTypes, PetOption>
}

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
