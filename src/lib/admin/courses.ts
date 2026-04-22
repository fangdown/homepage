import { supabaseAdmin } from '@/lib/supabase'

export interface Course {
  id: string
  title: string
  subtitle: string
  category: string
  description: string
  features: string[]
  price: number
  is_recommended: boolean
  cta_label: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface CourseInput {
  title: string
  subtitle: string
  category: string
  description: string
  features: string[]
  price: number
  is_recommended: boolean
  cta_label: string
  sort_order: number
}

export interface CourseValidationResult {
  success: boolean
  error?: string
}

function normalizeFeatures(features: string[]): string[] {
  return features.map((f) => f.trim()).filter(Boolean)
}

export async function validateCourse(data: CourseInput): Promise<CourseValidationResult> {
  if (!data.title?.trim()) return { success: false, error: '标题不能为空' }
  if (data.price < 0 || Number.isNaN(data.price)) return { success: false, error: '价格无效' }
  const feats = normalizeFeatures(data.features)
  if (feats.length === 0) return { success: false, error: '至少填写一条权益/要点' }
  return { success: true }
}

export async function validateCourseForUpdate(
  _id: string,
  data: CourseInput
): Promise<CourseValidationResult> {
  return validateCourse(data)
}

function rowFromDb(row: Record<string, unknown>): Course {
  const rawFeatures = row.features
  let features: string[] = []
  if (Array.isArray(rawFeatures)) {
    features = rawFeatures.map(String)
  } else if (typeof rawFeatures === 'string') {
    try {
      const parsed = JSON.parse(rawFeatures) as unknown
      features = Array.isArray(parsed) ? parsed.map(String) : []
    } catch {
      features = []
    }
  }
  return {
    id: String(row.id),
    title: String(row.title ?? ''),
    subtitle: String(row.subtitle ?? ''),
    category: String(row.category ?? ''),
    description: String(row.description ?? ''),
    features,
    price: Number(row.price ?? 0),
    is_recommended: Boolean(row.is_recommended),
    cta_label: String(row.cta_label ?? '立即加入'),
    sort_order: Number(row.sort_order ?? 0),
    created_at: String(row.created_at ?? ''),
    updated_at: String(row.updated_at ?? ''),
  }
}

const COURSES_LIST_LIMIT = 100

export async function getCourses(): Promise<Course[]> {
  const { data, error } = await supabaseAdmin
    .from('courses')
    .select('*')
    .order('sort_order', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(COURSES_LIST_LIMIT)

  if (error) throw error
  return (data ?? []).map((r) => rowFromDb(r as Record<string, unknown>))
}

export async function getCourse(id: string): Promise<Course | null> {
  const { data, error } = await supabaseAdmin.from('courses').select('*').eq('id', id).single()

  if (error) return null
  return data ? rowFromDb(data as Record<string, unknown>) : null
}

export async function createCourse(data: CourseInput): Promise<Course> {
  const feats = normalizeFeatures(data.features)
  const payload = {
    title: data.title.trim(),
    subtitle: data.subtitle.trim(),
    category: data.category.trim(),
    description: data.description.trim(),
    features: feats,
    price: data.price,
    is_recommended: data.is_recommended,
    cta_label: data.cta_label.trim() || '立即加入',
    sort_order: data.sort_order,
    updated_at: new Date().toISOString(),
  }

  const { data: result, error } = await supabaseAdmin.from('courses').insert(payload).select().single()

  if (error) throw error
  return rowFromDb(result as Record<string, unknown>)
}

export async function updateCourse(id: string, data: CourseInput): Promise<Course | null> {
  const feats = normalizeFeatures(data.features)
  const payload = {
    title: data.title.trim(),
    subtitle: data.subtitle.trim(),
    category: data.category.trim(),
    description: data.description.trim(),
    features: feats,
    price: data.price,
    is_recommended: data.is_recommended,
    cta_label: data.cta_label.trim() || '立即加入',
    sort_order: data.sort_order,
    updated_at: new Date().toISOString(),
  }

  const { data: result, error } = await supabaseAdmin
    .from('courses')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) return null
  return result ? rowFromDb(result as Record<string, unknown>) : null
}

export async function deleteCourse(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin.from('courses').delete().eq('id', id)
  if (error) return false
  return true
}
