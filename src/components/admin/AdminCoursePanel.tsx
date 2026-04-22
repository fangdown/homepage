'use client'

import { useState, useEffect } from 'react'
import type { Course, CourseInput } from '@/lib/admin/courses'
import {
  listCoursesAction,
  addCourseAction,
  editCourseAction,
  removeCourseAction,
} from '@/app/actions'

const emptyForm: CourseInput = {
  title: '',
  subtitle: '',
  category: '',
  description: '',
  features: [],
  price: 0,
  is_recommended: false,
  cta_label: '立即加入',
  sort_order: 0,
}

function courseToForm(c: Course): CourseInput {
  return {
    title: c.title,
    subtitle: c.subtitle,
    category: c.category,
    description: c.description,
    features: c.features,
    price: c.price,
    is_recommended: c.is_recommended,
    cta_label: c.cta_label,
    sort_order: c.sort_order,
  }
}

export default function AdminCoursePanel() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [listError, setListError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Course | null>(null)
  const [formData, setFormData] = useState<CourseInput>(emptyForm)
  const [featuresText, setFeaturesText] = useState('')
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function loadCourses() {
    setListError(null)
    setIsLoading(true)
    try {
      const data = await listCoursesAction()
      setCourses(data)
    } catch (e) {
      console.error(e)
      setListError('课程列表加载失败，请检查网络或 Supabase 配置后重试。')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  function parseFeatures(): string[] {
    return featuresText.split('\n').map((s) => s.trim()).filter(Boolean)
  }

  function openAdd() {
    setEditing(null)
    setFormData(emptyForm)
    setFeaturesText('')
    setFormError('')
    setShowModal(true)
  }

  function openEdit(c: Course) {
    setEditing(c)
    setFormData(courseToForm(c))
    setFeaturesText(c.features.join('\n'))
    setFormError('')
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditing(null)
    setFormData(emptyForm)
    setFeaturesText('')
    setFormError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isSubmitting) return

    const payload: CourseInput = {
      ...formData,
      features: parseFeatures(),
    }

    setIsSubmitting(true)
    try {
      if (editing) {
        const r = await editCourseAction(editing.id, payload)
        if (r.error) {
          setFormError(r.error)
          setIsSubmitting(false)
          return
        }
      } else {
        const r = await addCourseAction(payload)
        if (r.error) {
          setFormError(r.error)
          setIsSubmitting(false)
          return
        }
      }
      closeModal()
      await loadCourses()
    } catch {
      setFormError('操作失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('确定要删除这门课程吗？')) return
    try {
      const r = await removeCourseAction(id)
      if (r.error) {
        alert(r.error)
        return
      }
      await loadCourses()
    } catch {
      alert('删除失败')
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">课程</h2>
        <button
          type="button"
          onClick={openAdd}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 text-sm"
        >
          + 添加课程
        </button>
      </div>

      {listError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-center">
          <p className="text-sm text-red-700">{listError}</p>
          <button
            type="button"
            onClick={() => void loadCourses()}
            className="mt-3 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-50"
          >
            重试
          </button>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full" />
          <span className="ml-3 text-gray-500">加载中...</span>
        </div>
      ) : courses.length === 0 ? (
        <p className="text-gray-400">暂无课程</p>
      ) : (
        <div className="border rounded-lg overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-3 text-sm font-medium text-gray-600">标题</th>
                <th className="text-left p-3 text-sm font-medium text-gray-600">分类</th>
                <th className="text-right p-3 text-sm font-medium text-gray-600">价格</th>
                <th className="text-center p-3 text-sm font-medium text-gray-600">推荐</th>
                <th className="text-right p-3 text-sm font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} className="border-b last:border-b-0">
                  <td className="p-3 text-gray-900">{c.title}</td>
                  <td className="p-3 text-gray-500 text-sm">{c.category}</td>
                  <td className="p-3 text-right tabular-nums">¥{Number(c.price).toFixed(2)}</td>
                  <td className="p-3 text-center text-sm">{c.is_recommended ? '是' : '—'}</td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(c)}
                      className="text-blue-600 hover:text-blue-800 text-sm mr-4"
                    >
                      编辑
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editing ? '编辑课程' : '添加课程'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">副标题</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  权益要点（每行一条）
                </label>
                <textarea
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md font-mono text-sm"
                  rows={6}
                  placeholder="每行一条"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">价格</label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) =>
                      setFormData({ ...formData, sort_order: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">按钮文案</label>
                <input
                  type="text"
                  value={formData.cta_label}
                  onChange={(e) => setFormData({ ...formData, cta_label: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.is_recommended}
                  onChange={(e) => setFormData({ ...formData, is_recommended: e.target.checked })}
                />
                显示「推荐」角标
              </label>
              {formError && <p className="text-red-500 text-sm">{formError}</p>}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600">
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
                >
                  {isSubmitting ? '处理中...' : editing ? '保存' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
