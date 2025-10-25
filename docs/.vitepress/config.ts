import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'My Project Notes',
  description: 'Project documentation with PR workflow',
  base: '/', // 若使用 GitHub Pages 且仓库名非 username.github.io 则改成 '/仓库名/'
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/index' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          collapsed: false,
          items: [
            { text: 'Introduction', link: '/guide/index' },
            { text: 'How to Contribute', link: '/guide/contribute' }
          ]
        }
      ]
    },

    // Giscus 参考示例，等生成完 script 再替换
    comment: {
      provider: 'giscus',
      repo: 'yourname/yourrepo',
      repoId: 'REPLACE_ME',
      category: 'General',
      categoryId: 'REPLACE_ME'
    }
  }
})
