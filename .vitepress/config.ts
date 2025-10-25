import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'

export default defineConfig({
  title: 'Knowledge Notes',
  description: '随着自己做的项目，学习内容的笔记。用来记录、打磨方法论。',
  
  // GitHub Pages 部署配置
  base: '/knowledge-notes/', // 替换为你的仓库名
  outDir: 'dist',
  
  // 多语言支持
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN'
    }
  },
  
  // 主题配置
  themeConfig: {
    // 网站标题
    siteTitle: 'Knowledge Notes',
    
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: 'Docker', link: '/docker/' },
      { text: 'PocketBase', link: '/pocketbase/' },
      { text: 'Traefik', link: '/traefik/' }
    ],
    
    // 自动生成侧边栏
    sidebar: generateSidebar({
      documentRootPath: '/',
      useTitleFromFileHeading: true,
      useFolderTitleFromIndexFile: true,
      useFolderLinkFromIndexFile: true,
      collapsed: false
    }),
    
    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/cont1nu1ty/knowledge-notes' }
    ],
    
    // 页脚
    footer: {
      message: '基于 VitePress 构建',
      copyright: 'Copyright © 2024 Knowledge Notes'
    },
    
    // 搜索
    search: {
      provider: 'local'
    },
    
    // 编辑链接
    editLink: {
      pattern: 'https://github.com/你的用户名/knowledge-notes/edit/main/:path',
      text: '在 GitHub 上编辑此页'
    },
    
    // 最后更新时间
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    }
  },
  
  // Markdown 配置
  markdown: {
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  }
})
