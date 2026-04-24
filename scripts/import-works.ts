import { works } from "@/data/works";
import { createProject, ProjectInput } from "@/lib/admin/projects";

async function importWorks() {
  console.log(`开始导入 ${works.length} 个作品...`);

  let successCount = 0;
  let failCount = 0;

  for (const work of works) {
    const input: ProjectInput = {
      title: work.title,
      description: work.description,
      github_url: work.githubUrl,
      preview_url: work.externalUrl,
      tags: work.tags,
      featured: work.featured ?? false,
    };

    try {
      const project = await createProject(input);
      console.log(`✓ 导入成功: ${project.title} (id: ${project.id})`);
      successCount++;
    } catch (error) {
      console.error(`✗ 导入失败: ${work.title}`, error);
      failCount++;
    }
  }

  console.log(`\n导入完成: 成功 ${successCount}, 失败 ${failCount}`);
}

importWorks().catch(console.error);
