'use client'

import { useState, useEffect } from 'react'
import { listProjectsAction } from '@/app/actions'
import WorkCard from './WorkCard'

interface Project {
  id: string
  title: string
  description: string
  tags?: string[]
  github_url?: string
  preview_url?: string
  featured?: boolean
}

export default function WorksSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    setLoadError(null)
    setIsLoading(true)
    try {
      const data = await listProjectsAction()
      setProjects(data)
    } catch (err) {
      console.error('Failed to load projects:', err)
      setLoadError('作品列表加载失败，请检查网络或稍后重试。')
    } finally {
      setIsLoading(false)
    }
  }

  const featuredProjects = projects.filter((project) => project.featured)

  return (
    <section id="works" className="py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-foreground">
          Featured Works
        </h2>

        {loadError ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-6 text-center">
            <p className="text-sm text-red-200/90">{loadError}</p>
            <button
              type="button"
              onClick={() => void loadProjects()}
              className="mt-4 rounded-lg border border-gold/40 px-4 py-2 text-sm text-gold hover:bg-gold/10"
            >
              重试
            </button>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-gold/30 border-t-gold rounded-full" />
            <span className="ml-3 text-foreground/50">加载中…</span>
          </div>
        ) : featuredProjects.length === 0 ? (
          <p className="text-gray-400">暂无作品</p>
        ) : (
          <>
            {/* Featured Works Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {featuredProjects.map((project) => (
                <WorkCard
                  key={project.id}
                  work={{
                    id: project.id,
                    title: project.title,
                    description: project.description,
                    tags: project.tags || [],
                    githubUrl: project.github_url,
                    externalUrl: project.preview_url,
                    featured: project.featured,
                  }}
                />
              ))}
            </div>

            {/* All Works */}
            {projects.length > featuredProjects.length && (
              <>
                <h3 className="text-xl font-semibold mb-4 text-foreground">所有作品</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects
                    .filter((p) => !p.featured)
                    .map((project) => (
                      <WorkCard
                        key={project.id}
                        work={{
                          id: project.id,
                          title: project.title,
                          description: project.description,
                          tags: project.tags || [],
                          githubUrl: project.github_url,
                          externalUrl: project.preview_url,
                          featured: project.featured,
                        }}
                      />
                    ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  )
}