---
title: 同步笔记
description: 如何使用 NotionNext 插件将你的 Obsidian 笔记同步到 Notion
---

# 同步笔记

在插件设置中配置好你的 Notion 数据库后，你就可以开始将 Obsidian 笔记同步到 Notion 了。

## 手动同步

要同步一篇笔记，只需打开你想要同步的笔记，然后从命令面板（`Ctrl/Cmd + P`）或笔记的右键菜单中选择 "Share to NotionNext" 命令。这会在你的 Notion 数据库中创建一个新页面，内容与你的 Obsidian 笔记完全一致。

## 自动同步

插件支持自动同步功能，可以监控你的笔记变化并自动同步到 Notion。

### 启用自动同步

1. 打开插件设置
2. 在通用设置下找到"自动同步"开关
3. 开启该开关
4. 配置"自动同步延迟时间"（默认：5秒，最小：2秒）

### 准备 Frontmatter

自动同步会读取你在 **设置 → 自动同步 Frontmatter 键名** 中配置的键名（默认为 `autosync-database`）来确定要同步的数据库。要让你的笔记能够自动同步：

- 在笔记的 frontmatter 中添加配置的键名
- 列出一个或多个你在插件设置中定义的数据库简称
- 如果修改了笔记要同步的数据库，记得更新列表

示例（使用默认键名）：

```yaml
---
title: 我的文章
autosync-database: [blog, portfolio]
---
```

如果你在设置中修改了键名，记得同时更新你的 frontmatter。

### 自动同步工作原理

当自动同步启用后：

- 插件会监控 Markdown 文件的变化
- 在你停止编辑达到配置的延迟时间后，自动触发同步
- **支持首次自动上传**：无需先手动同步，只要添加 frontmatter 键名，插件会自动处理首次上传
- 如果文件关联了多个数据库，会自动同步到所有数据库
- 首次同步后，会自动在 frontmatter 中添加 `NotionID-{数据库}` 用于后续更新

### 自动同步场景示例

#### 场景 A-1：新文件缺少自动同步配置

```yaml
---
title: 我的新文章
tags: [博客, 技术]
---
```

**行为：**

- ✅ 检测到缺少自动同步配置键
- ✅ 检测到没有 NotionID（新文件）
- ✅ 静默跳过，不显示任何提示
- 📝 **如需启用自动同步：** 在 frontmatter 中添加 `autosync-database: [你的数据库简称]`

#### 场景 A-2：已同步文件缺少自动同步配置

```yaml
---
title: 我的文章
NotionID-blog: abc123
---
```

**行为：**

- ✅ 检测到缺少自动同步配置键
- ✅ 检测到已存在 NotionID（说明之前同步过）
- ✅ 显示提示："⚠️ 自动同步已跳过：请在 frontmatter 中添加 autosync-database 以指定目标数据库"
- ✅ 不执行同步操作
- 📝 **需要操作：** 在 frontmatter 中添加 `autosync-database: [blog]`

#### 场景 B：新文档（首次自动上传）

```yaml
---
title: 我的新文章
autosync-database: [blog]
---
```

**行为：**

- ✅ 检测到没有 NotionID，但配置了 `autosync-database`
- ✅ 自动执行首次上传到 Blog 数据库
- ✅ 上传成功后自动添加 `NotionID-blog: xxx` 到 frontmatter
- ✅ 显示成功/失败通知
- 📝 **无需操作：** 插件会自动处理首次上传

#### 场景 C：已同步到一个数据库（更新）

```yaml
---
title: 我的文章
NotionID-blog: abc123
autosync-database: [blog]
---
```

**行为：**

- ✅ 检测到 1 个 NotionID
- ✅ 自动同步更新到 Blog 数据库
- ✅ 显示上传命令返回的成功/失败通知
- 📝 **无需操作：** 变更会自动同步

#### 场景 D：同步到多个数据库

```yaml
---
title: 我的文章  
NotionID-blog: abc123
NotionID-portfolio: def456
NotionID-notes: ghi789
autosync-database: [blog, portfolio, notes]
---
```

**行为：**

- ✅ 检测到 3 个数据库目标
- ✅ 显示提示："🔄 自动同步：正在同步到 3 个数据库..."
- ✅ 依次同步到所有 3 个数据库
- ✅ 为每个数据库显示独立的结果通知
- 📝 **无需操作：** 变更会自动同步到所有关联的数据库

### 自动同步最佳实践

1. **添加 Frontmatter 配置**：只需添加 `autosync-database: [你的数据库]` 即可启用自动同步，无需手动上传
2. **合理配置延迟**：如果你经常编辑，设置较长的延迟时间（5-10 秒）
3. **监控同步状态**：注意查看通知以确保同步成功完成
4. **查看日志**：打开开发者控制台（Ctrl+Shift+I / Cmd+Option+I）查看详细的同步日志

### 故障排除

遇到自动同步问题？请查看[问题排查指南](05-troubleshooting.md)获取常见问题的详细解决方案。
