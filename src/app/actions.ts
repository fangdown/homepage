'use server'

import { validatePassword } from '@/lib/admin/auth'
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  validateProject,
  validateProjectForUpdate,
  ProjectInput,
  Project,
} from '@/lib/admin/projects'
import {
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse,
  validateCourse,
  validateCourseForUpdate,
  CourseInput,
  Course,
} from '@/lib/admin/courses'
import { getOrders, type Order } from '@/lib/admin/orders'

export async function loginAdminAction(password: string) {
  return validatePassword(password)
}

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

export async function listCoursesAction(): Promise<Course[]> {
  return getCourses()
}

export async function addCourseAction(data: CourseInput): Promise<{ success?: Course; error?: string }> {
  const validation = await validateCourse(data)
  if (!validation.success) {
    return { error: validation.error }
  }
  try {
    const course = await createCourse(data)
    return { success: course }
  } catch {
    return { error: '创建失败' }
  }
}

export async function editCourseAction(id: string, data: CourseInput): Promise<{ success?: Course; error?: string }> {
  const validation = await validateCourseForUpdate(id, data)
  if (!validation.success) {
    return { error: validation.error }
  }
  try {
    const course = await updateCourse(id, data)
    if (!course) {
      return { error: '课程不存在' }
    }
    return { success: course }
  } catch {
    return { error: '更新失败' }
  }
}

export async function removeCourseAction(id: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const deleted = await deleteCourse(id)
    if (!deleted) {
      return { error: '课程不存在' }
    }
    return { success: true }
  } catch {
    return { error: '删除失败' }
  }
}

export async function listOrdersAction(): Promise<Order[]> {
  return getOrders()
}