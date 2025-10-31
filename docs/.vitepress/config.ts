import { defineConfig } from 'vitepress'
import { withSidebar } from 'vitepress-sidebar';

// https://vitepress.dev/reference/site-config
const vitePressOptions = {
  title: "Obsidian to NotionNext",
  description: "A plugin to share files to any Notion database using the Notion API.",

  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/jxpeng98/obsidian-to-NotionNext' }
    ]
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Guide', link: '/en/01-getting-started' }
        ],
      }
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      themeConfig: {
        nav: [
          { text: '首页', link: '/zh/' },
          { text: '指南', link: '/zh/01-getting-started' }
        ],
      }
    }
  }
};


const commonSidebarOptions = {
  documentRootPath: '/docs',
  useTitleFromFrontmatter: true,
  frontmatterTitleFieldName: 'title',
  collapsed: true,
  removePrefixAfterOrdering: true,
  prefixSeparator: '-',
  hyphenToSpace: true,
  useFolderTitleFromIndexFile: true,
  useFolderLinkFromIndexFile: true,
  sortMenusByName: false,
};

const vitePressSidebarOptions = [
  {
    ...commonSidebarOptions,
    scanStartPath: '/en',
    basePath: '/',
    resolvePath: '/en/'
  },
  {
    ...commonSidebarOptions,
    scanStartPath: '/zh',
    basePath: '/',
    resolvePath: '/zh/',
  }
];

export default defineConfig(withSidebar(vitePressOptions, vitePressSidebarOptions));