---
title: Syncing Notes
description: How to sync your Obsidian notes to Notion using the NotionNext plugin
---

# Syncing Notes

After configuring your Notion database in the plugin settings, you can start syncing your Obsidian notes to Notion.

## Manual Sync

To sync a note, open the note you want to sync and use the "Share to NotionNext" command from the command palette or the note context menu. This will create a new page in your Notion database with the content of your Obsidian note.

## Auto Sync

The plugin supports automatic syncing that monitors your notes for changes and automatically syncs them to Notion.

### Enabling Auto Sync

1. Open the plugin settings
2. Find the "Auto Sync" toggle under General Settings
3. Enable the toggle
4. Configure the "Auto Sync Delay" (default: 5 seconds, minimum: 2 seconds)

### How Auto Sync Works

When auto sync is enabled:
- The plugin monitors markdown files for changes
- After you stop editing for the configured delay period, auto sync is triggered
- Only files that have already been synced to Notion (have a NotionID in frontmatter) will be auto-synced
- If a file is linked to multiple databases, it will sync to all of them automatically

### Auto Sync Scenarios

#### Scenario A: New Document (Not Yet Synced)

```yaml
---
title: My New Article
tags: [blog, tech]
---
```

**Behavior:**
- ✅ Detects no NotionID present
- ✅ Shows notice: "⚠️ Auto sync skipped: This document has not been synced to Notion, please upload manually first"
- ✅ No sync operation performed
- 📝 **Action Required:** Manually sync the document first using the command palette

#### Scenario B: Synced to One Database

```yaml
---
title: My Article
NotionID-blog: abc123
---
```

**Behavior:**
- ✅ Detects 1 NotionID
- ✅ Automatically syncs to the Blog database
- ✅ Shows success/failure notification from the upload command
- 📝 **No Action Required:** Changes are automatically synced

#### Scenario C: Synced to Multiple Databases

```yaml
---
title: My Article  
NotionID-blog: abc123
NotionID-portfolio: def456
NotionID-notes: ghi789
---
```

**Behavior:**
- ✅ Detects 3 NotionIDs
- ✅ Shows notice: "🔄 Auto sync: Syncing to 3 database(s)..."
- ✅ Syncs to all 3 databases sequentially
- ✅ Shows individual result notifications for each database
- 📝 **No Action Required:** Changes are automatically synced to all linked databases

### Auto Sync Best Practices

1. **First Sync Manually**: Always perform the first sync manually to establish the NotionID link
2. **Configure Delay Appropriately**: Set a longer delay (5-10 seconds) if you make frequent edits
3. **Monitor Sync Status**: Check the notifications to ensure syncs complete successfully
4. **Check Logs**: Open the developer console (Ctrl+Shift+I / Cmd+Option+I) to view detailed sync logs

### Troubleshooting

Having issues with auto sync? Check the [Troubleshooting Guide](05-troubleshooting.md) for detailed solutions to common problems.
