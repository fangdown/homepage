import { supabaseAdmin } from '@/lib/supabase'

export interface Project {
  id: string
  title: string
  description: string
  cover_image?: string
  github_url?: string
  preview_url?: string
  created_at: string
  updated_at: string
}

export interface ProjectInput {
  title: string
  description: string
  cover_image?: string
  github_url?: string
  preview_url?: string
}

export interface ValidationResult {
  success: boolean
  error?: string
}

export async function validateProject(data: ProjectInput): Promise<ValidationResult> {
  if (!data.title || data.title.trim() === '') {
    return { success: false, error: '标题不能为空' }
  }
  return { success: true }
}

export async function validateProjectForUpdate(
  _id: string,
  data: ProjectInput
): Promise<ValidationResult> {
  if (!data.title || data.title.trim() === '') {
    return { success: false, error: '标题不能为空' }
  }
  return { success: true }
}

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getProject(id: string): Promise<Project | null> {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function createProject(data: ProjectInput): Promise<Project> {
  const { data: result, error } = await supabaseAdmin
    .from('projects')
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return result
}

export async function updateProject(id: string, data: ProjectInput): Promise<Project | null> {
  const { data: result, error } = await supabaseAdmin
    .from('projects')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) return null
  return result
}

export async function deleteProject(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) return false
  return true
}