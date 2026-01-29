---
title: 更新日志
description: Obsidian to NotionNext 的版本更新与变更记录
---

欢迎来到 Obsidian to NotionNext 的更新日志！这里会记录自 `2.7.0` 版本起的所有更新、改进以及问题修复，方便你快速了解插件的演进情况。

## v2.8.0 (2026-01-29)

### 新增

- **自动同步**：当内容或 frontmatter 变化时自动同步，支持可配置延迟与多数据库
- **附件上传**：通过 File Upload API 上传本地图片与 PDF，并插入为 `image`/`file` 块
- **自动复制 Notion 链接**：同步后自动复制页面链接到剪贴板
- **自动同步 frontmatter key**：可自定义自动同步数据库列表的 frontmatter key（默认 `autosync-database`）
- 完整的 UI 与通知 i18n 支持
- 通过 GitHub Actions + BRAT 的预发布测试流程

### 变更

- 优化自动同步行为与提示：无 `autosync-database` 或缺少 NotionID 的文件处理更智能
- 限制附件链接解析为 **Wikilinks** 与 **标准 Markdown 链接**（Obsidian/App URL 暂停/待办）
- 统一 Notion API 请求头 `Notion-Version` 为 `2025-09-03`
- 单文件上传限制降为 **5MB**，提升兼容性
- 强化设置面板与自动同步相关文档

### 修复

- 移动端兼容性修复：使用 `window.setTimeout` 替代 `NodeJS.Timeout`
- 防止同步循环，改进 frontmatter/正文变更检测
- 修复 Markdown 下划线导致的占位符解析问题
- 修复附件独占行时的块顺序
- 保留 `external` 图片转为 `file_upload` 时的图片标题
- 避免上传 `file` 块时重复显示文件名
- 修复同步成功通知出现 `undefined`（补充 `sync-preffix` i18n key）
