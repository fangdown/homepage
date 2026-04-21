'use server'

import { createProject, getProjects, updateProject, deleteProject, validateProject, validateProjectForUpdate, ProjectInput, Project } from '@/lib/admin/projects'

export async function listProjectsAction(): Promise<Project[]> {
  return getProjects()
}

export async function addProjectAction(data: ProjectInput): Promise<{ success?: Project; error?: string }> {
  const validation = await validateProject(data)
  if (!validation.success) {
    return { error: validation.error }
  }
  try {
    const project = await createProject(data)
    return { success: project }
  } catch {
    return { error: '创建失败' }
  }
}

export async function editProjectAction(id: string, data: ProjectInput): Promise<{ success?: Project; error?: string }> {
  const validation = await validateProjectForUpdate(id, data)
  if (!validation.success) {
    return { error: validation.error }
  }
  try {
    const project = await updateProject(id, data)
    if (!project) {
      return { error: '作品不存在' }
    }
    return { success: project }
  } catch {
    return { error: '更新失败' }
  }
}

export async function removeProjectAction(id: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const deleted = await deleteProject(id)
    if (!deleted) {
      return { error: '作品不存在' }
    }
    return { success: true }
  } catch {
    return { error: '删除失败' }
  }
}