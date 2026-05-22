import { useState } from 'react'
import { Star, Users, BookOpen, GitFork, GitCompare, Search } from 'lucide-react'
import { useGitHubData } from './hooks/useGitHubData'
import { SearchBar } from './components/SearchBar'
import { ProfileCard } from './components/ProfileCard'
import { LanguageChart } from './components/LanguageChart'
import { RepoList } from './components/RepoList'
import { ActivityChart } from './components/ActivityChart'
import { StatsCard } from './components/StatsCard'
import { SkeletonLoader } from './components/SkeletonLoader'
import { CompareSearch } from './components/CompareSearch'
import { StatComparison } from './components/StatComparison'
import { UserColumn } from './components/UserColumn'

type Mode = 'search' | 'compare'

function totalStars(repos: ReturnType<typeof useGitHubData>['repos']) {
  return repos.reduce((s, r) => s + r.stargazers_count, 0)
}
function totalForks(repos: ReturnType<typeof useGitHubData>['repos']) {
  return repos.reduce((s, r) => s + r.forks_count, 0)
}

export default function App() {
  const [mode, setMode] = useState<Mode>('search')
  const single = useGitHubData()
  const left = useGitHubData()
  const right = useGitHubData()

  const bothLoaded = left.user && right.user && !left.loading && !right.loading

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 px-4 pt-10 pb-14">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">
            GitHub Stats Dashboard
          </h1>
          <p className="text-blue-300 text-sm mb-4">
            Visualize any GitHub profile — repos, languages, activity
          </p>
          <a
            href="/nexus/GitHub%20Nexus.html"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-cyan-400/40 bg-cyan-400/10 text-cyan-300 text-xs font-semibold tracking-widest hover:bg-cyan-400/20 transition-colors"
          >
            ✦ Try GitHub Nexus — Cinematic Mode ✦
          </a>

          {/* Mode toggle */}
          <div className="inline-flex rounded-xl bg-white/10 p-1 mb-6">
            <button
              onClick={() => setMode('search')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === 'search'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Search size={14} /> Search
            </button>
            <button
              onClick={() => setMode('compare')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === 'compare'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <GitCompare size={14} /> Compare
            </button>
          </div>

          {mode === 'search' ? (
            <SearchBar onSearch={single.fetch} loading={single.loading} />
          ) : (
            <CompareSearch
              onSearchLeft={left.fetch}
              onSearchRight={right.fetch}
              loadingLeft={left.loading}
              loadingRight={right.loading}
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-6 pb-12 flex flex-col gap-6">

        {/* ── SEARCH MODE ── */}
        {mode === 'search' && (
          <>
            {single.loading && <SkeletonLoader />}
            {single.error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl px-5 py-4 text-sm font-medium shadow-sm">
                {single.error}
              </div>
            )}
            {single.user && !single.loading && (
              <>
                <ProfileCard user={single.user} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <StatsCard label="Followers" value={single.user.followers} icon={<Users size={22} />} color="from-blue-500 to-blue-700" />
                  <StatsCard label="Repositories" value={single.user.public_repos} icon={<BookOpen size={22} />} color="from-violet-500 to-violet-700" />
                  <StatsCard label="Total Stars" value={totalStars(single.repos)} icon={<Star size={22} />} color="from-amber-400 to-orange-500" />
                  <StatsCard label="Total Forks" value={totalForks(single.repos)} icon={<GitFork size={22} />} color="from-emerald-500 to-teal-600" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <LanguageChart repos={single.repos} />
                  <ActivityChart events={single.events} />
                </div>
                <RepoList repos={single.repos} />
              </>
            )}
            {!single.user && !single.loading && !single.error && (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-gray-400 dark:text-gray-500 text-base">Search a GitHub username to see their stats</p>
                <p className="text-gray-300 dark:text-gray-600 text-sm mt-1">
                  Try{' '}
                  <button onClick={() => single.fetch('torvalds')} className="text-blue-500 hover:underline">torvalds</button>
                  {' '}or{' '}
                  <button onClick={() => single.fetch('gaearon')} className="text-blue-500 hover:underline">gaearon</button>
                </p>
              </div>
            )}
          </>
        )}

        {/* ── COMPARE MODE ── */}
        {mode === 'compare' && (
          <>
            {(left.loading || right.loading) && <SkeletonLoader />}

            {(left.error || right.error) && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl px-5 py-4 text-sm font-medium shadow-sm">
                {left.error ?? right.error}
              </div>
            )}

            {bothLoaded && (
              <>
                {/* Stat comparison bars */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-5 text-center">Head to Head</h3>
                  <div className="flex flex-col gap-5">
                    <StatComparison label="Followers" valueA={left.user!.followers} valueB={right.user!.followers} nameA={left.user!.login} nameB={right.user!.login} />
                    <StatComparison label="Public Repos" valueA={left.user!.public_repos} valueB={right.user!.public_repos} nameA={left.user!.login} nameB={right.user!.login} />
                    <StatComparison label="Total Stars" valueA={totalStars(left.repos)} valueB={totalStars(right.repos)} nameA={left.user!.login} nameB={right.user!.login} />
                    <StatComparison label="Total Forks" valueA={totalForks(left.repos)} valueB={totalForks(right.repos)} nameA={left.user!.login} nameB={right.user!.login} />
                    <StatComparison label="Following" valueA={left.user!.following} valueB={right.user!.following} nameA={left.user!.login} nameB={right.user!.login} />
                  </div>
                </div>

                {/* Side-by-side columns */}
                <div className="grid grid-cols-2 gap-4">
                  <UserColumn user={left.user!} repos={left.repos} events={left.events} accent="ring-blue-500" />
                  <UserColumn user={right.user!} repos={right.repos} events={right.events} accent="ring-purple-500" />
                </div>
              </>
            )}

            {!left.user && !right.user && !left.loading && !right.loading && (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">⚔️</div>
                <p className="text-gray-400 dark:text-gray-500 text-base">Enter two GitHub usernames to compare them</p>
                <p className="text-gray-300 dark:text-gray-600 text-sm mt-1">
                  Try{' '}
                  <button onClick={() => { left.fetch('torvalds'); right.fetch('gaearon') }} className="text-blue-500 hover:underline">
                    torvalds vs gaearon
                  </button>
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <footer className="text-center text-xs text-gray-400 dark:text-gray-600 pb-6">
        GitHub Stats Dashboard · Data from GitHub REST API
      </footer>
    </div>
  )
}
