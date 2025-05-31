import { getMainClient } from '@/services/api'
import { useEffect, useState } from 'react'

const cachedTimezones: Map<string, Timezone[]> = new Map()

export const useTimezones = () => {
  const [data, setData] = useState<Timezone[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchTimezones = async () => {
      try {
        const cacheKey = 'all-timezones'
        if (cachedTimezones.has(cacheKey)) {
          setData(cachedTimezones.get(cacheKey) as Timezone[])
          setLoading(false)
          return
        }

        setLoading(true)
        const timezones = await getTimezones()
        setData(timezones)

        cachedTimezones.set(cacheKey, timezones)
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('An unknown error occurred'),
        )
      } finally {
        setLoading(false)
      }
    }

    fetchTimezones()
  }, [])

  return { data, loading, error }
}

export interface Timezone {
  label: string
  value: string
  offset: string
}

export async function getTimezones(): Promise<Timezone[]> {
  try {
    const api = await getMainClient()
    const response = await api.get<Timezone[]>('/date/timezones')
    return response.data
  } catch (error) {
    console.error('Error fetching timezones:', error)
    return []
  }
}
