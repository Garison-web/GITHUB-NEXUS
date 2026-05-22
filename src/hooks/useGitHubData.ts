import { useState, useCallback } from 'react'
import { getUser, getRepos, getEvents } from '../api/github'
import type { GitHubUser, GitHubRepo, GitHubEvent } from '../types/github'

export interface GitHubData {
  user: GitHubUser | null
  repos: GitHubRepo[]
  events: GitHubEvent[]
  loading: boolean
  error: string | null
}

export function useGitHubData() {
  const [data, setData] = useState<GitHubData>({
    user: null,
    repos: [],
    events: [],
    loading: false,
    error: null,
  })

  const fetch = useCallback(async (username: string) => {
    setData({ user: null, repos: [], events: [], loading: true, error: null })
    try {
      const [user, repos, events] = await Promise.all([
        getUser(username),
        getRepos(username),
        getEvents(username),
      ])
      setData({ user, repos, events, loading: false, error: null })
    } catch (err) {
      setData(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      }))
    }
  }, [])

  return { ...data, fetch }
}
