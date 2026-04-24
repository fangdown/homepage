"use client";

import { useState, useEffect } from "react";
import { Project, ProjectInput } from "@/lib/admin/projects";
import {
  loginAdminAction,
  listProjectsAction,
  addProjectAction,
  editProjectAction,
  removeProjectAction,
} from "@/app/actions";
import AdminCoursePanel from "@/components/admin/AdminCoursePanel";
import AdminOrdersPanel from "@/components/admin/AdminOrdersPanel";

interface ProjectFormData {
  title: string;
  description: string;
  github_url: string;
  preview_url: string;
  featured: boolean;
}

const emptyForm: ProjectFormData = {
  title: "",
  description: "",
  github_url: "",
  preview_url: "",
  featured: false,
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>(emptyForm);
  const [tagsText, setTagsText] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminTab, setAdminTab] = useState<"projects" | "courses" | "orders">(
    "projects",
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await loginAdminAction(password);
    if (result.success) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError(result.error || "验证失败");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
    }
  }, [isAuthenticated]);

  async function loadProjects() {
    setIsLoading(true);
    try {
      const data = await listProjectsAction();
      setProjects(data);
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setIsLoading(false);
    }
  }

  function parseTags(): string[] {
    return tagsText
      .split(/[\n,，]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function openAddModal() {
    setEditingProject(null);
    setFormData(emptyForm);
    setTagsText("");
    setFormError("");
    setShowModal(true);
  }

  function openEditModal(project: Project) {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      github_url: project.github_url || "",
      preview_url: project.preview_url || "",
      featured: project.featured ?? false,
    });
    setTagsText((project.tags || []).join("\n"));
    setFormError("");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingProject(null);
    setFormData(emptyForm);
    setTagsText("");
    setFormError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;

    const data: ProjectInput = {
      title: formData.title,
      description: formData.description,
      github_url: formData.github_url || undefined,
      preview_url: formData.preview_url || undefined,
      tags: parseTags(),
      featured: formData.featured,
    };

    setIsSubmitting(true);
    try {
      if (editingProject) {
        const result = await editProjectAction(editingProject.id, data);
        if (result.error) {
          setFormError(result.error);
          setIsSubmitting(false);
          return;
        }
      } else {
        const result = await addProjectAction(data);
        if (result.error) {
          setFormError(result.error);
          setIsSubmitting(false);
          return;
        }
      }
      closeModal();
      await loadProjects();
    } catch (err) {
      console.error("Submit failed:", err);
      setFormError("操作失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (confirm("确定要删除这个作品吗？")) {
      try {
        const result = await removeProjectAction(id);
        if (result.error) {
          alert(result.error);
          return;
        }
        await loadProjects();
      } catch (err) {
        console.error("Delete failed:", err);
        alert("删除失败");
      }
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-lg border w-80"
        >
          <h1 className="text-xl font-bold mb-4 text-center">管理后台</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码"
            className="w-full px-4 py-2 border rounded-lg mb-4"
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
          >
            进入
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">管理后台</h1>

        <div className="flex gap-2 mb-8 border-b border-gray-200">
          <button
            type="button"
            onClick={() => setAdminTab("projects")}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              adminTab === "projects"
                ? "border-black text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            作品
          </button>
          <button
            type="button"
            onClick={() => setAdminTab("courses")}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              adminTab === "courses"
                ? "border-black text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            课程
          </button>
          <button
            type="button"
            onClick={() => setAdminTab("orders")}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              adminTab === "orders"
                ? "border-black text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            订单
          </button>
        </div>

        {adminTab === "projects" && (
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">作品</h2>
              <button
                type="button"
                onClick={openAddModal}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 text-sm"
              >
                + 添加
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full"></div>
                <span className="ml-3 text-gray-500">加载中...</span>
              </div>
            ) : projects.length === 0 ? (
              <p className="text-gray-400">暂无作品</p>
            ) : (
              <div className="border rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3 text-sm font-medium text-gray-600">
                        标题
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-gray-600">
                        描述
                      </th>
                      <th className="text-right p-3 text-sm font-medium text-gray-600">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id} className="border-b last:border-b-0">
                        <td className="p-3 text-gray-900">{project.title}</td>
                        <td className="p-3 text-gray-500 text-sm">
                          {project.description}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => openEditModal(project)}
                            className="text-blue-600 hover:text-blue-800 text-sm mr-4"
                          >
                            编辑
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(project.id)}
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
          </section>
        )}

        {adminTab === "courses" && (
          <section className="mb-8">
            <AdminCoursePanel />
          </section>
        )}

        {adminTab === "orders" && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">订单</h2>
            <AdminOrdersPanel />
          </section>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingProject ? "编辑作品" : "添加作品"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  标题
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="作品标题"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  描述
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  placeholder="作品描述"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub 链接
                </label>
                <input
                  type="url"
                  value={formData.github_url}
                  onChange={(e) =>
                    setFormData({ ...formData, github_url: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="https://github.com/..."
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  预览链接
                </label>
                <input
                  type="url"
                  value={formData.preview_url}
                  onChange={(e) =>
                    setFormData({ ...formData, preview_url: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="https://..."
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  标签
                </label>
                <textarea
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md font-mono text-sm"
                  rows={3}
                  placeholder={
                    "每行一个，或用逗号分隔，例如：\nVue3\nTypeScript"
                  }
                />
                <p className="mt-1 text-xs text-gray-500">
                  首页作品卡片会展示标签；留空则无标签。
                </p>
              </div>
              <div className="mb-4 flex items-center gap-2">
                <input
                  id="project-featured"
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label
                  htmlFor="project-featured"
                  className="text-sm font-medium text-gray-700"
                >
                  设为精选（Featured）
                </label>
              </div>
              <p className="text-xs text-gray-500 mb-4 -mt-2">
                精选作品出现在首页「Featured Works」；未勾选列在「所有作品」。
              </p>
              {formError && (
                <p className="text-red-500 text-sm mb-4">{formError}</p>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
                >
                  {isSubmitting
                    ? "处理中..."
                    : editingProject
                      ? "保存"
                      : "添加"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
