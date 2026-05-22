import type { GitHubUser, GitHubRepo, GitHubEvent } from '../types/github'

const BASE = 'https://api.github.com'

const token = import.meta.env.VITE_GITHUB_TOKEN

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  if (!res.ok) {
    if (res.status === 404) throw new Error('User not found')
    if (res.status === 403) throw new Error('Rate limit exceeded — try again later')
    throw new Error(`GitHub API error: ${res.status}`)
  }
  return res.json()
}

export const getUser = (username: string) =>
  request<GitHubUser>(`/users/${username}`)

export const getRepos = (username: string) =>
  request<GitHubRepo[]>(`/users/${username}/repos?per_page=100&sort=updated`)

export const getEvents = (username: string) =>
  request<GitHubEvent[]>(`/users/${username}/events/public?per_page=100`)
