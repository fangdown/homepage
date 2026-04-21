import { works } from '@/data/works'
import { supabaseAdmin } from '@/lib/supabase'

async function updateWorks() {
  console.log(`开始更新 ${works.length} 个作品的 tags 和 featured...`)

  let successCount = 0
  let failCount = 0

  for (const work of works) {
    try {
      const { data, error } = await supabaseAdmin
        .from('projects')
        .update({
          tags: work.tags,
          featured: work.featured ?? false,
        })
        .eq('title', work.title)
        .select()
        .single()

      if (error) throw error
      console.log(`✓ 更新成功: ${data.title} (tags: ${data.tags}, featured: ${data.featured})`)
      successCount++
    } catch (error) {
      console.error(`✗ 更新失败: ${work.title}`, error)
      failCount++
    }
  }

  console.log(`\n更新完成: 成功 ${successCount}, 失败 ${failCount}`)
}

updateWorks().catch(console.error)