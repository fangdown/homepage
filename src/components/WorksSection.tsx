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

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    try {
      const data = await listProjectsAction()
      setProjects(data)
    } catch (err) {
      console.error('Failed to load projects:', err)
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

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full"></div>
            <span className="ml-3 text-gray-500">加载中...</span>
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