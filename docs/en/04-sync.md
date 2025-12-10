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

### Prepare the Frontmatter

Auto sync reads the database list from the frontmatter key you configured in **Settings → Auto Sync Frontmatter Key** (default: `autosync-database`). To make sure your notes can sync automatically:

- Add the configured key to your note's frontmatter
- List one or more database abbreviations that you defined in the plugin settings
- Keep the list updated if you change the databases a note should sync to

Example with the default key:

```yaml
---
title: My Article
autosync-database: [blog, portfolio]
---
```

If you change the key name in the settings, update your frontmatter to match.

### How Auto Sync Works

When auto sync is enabled:
- The plugin monitors markdown files for changes
- After you stop editing for the configured delay period, auto sync is triggered
- Files with the `autosync-database` key in frontmatter will be automatically synced
- **First-time upload is supported**: No need to manually sync first - just add the frontmatter key and the plugin will handle the initial upload
- If a file is linked to multiple databases, it will sync to all of them automatically
- After the first sync, a `NotionID-{database}` will be added to the frontmatter for future updates

### Auto Sync Scenarios

#### Scenario A-1: New File Missing Auto Sync Entry

```yaml
---
title: My New Article
tags: [blog, tech]
---
```

**Behavior:**
- ✅ Detects that the auto sync key is missing
- ✅ Detects no NotionID present (new file)
- ✅ Silently skips - no notice shown
- 📝 **To enable auto sync:** Add `autosync-database: [your-db-abbreviation]` to the frontmatter

#### Scenario A-2: Synced File Missing Auto Sync Entry

```yaml
---
title: My Article
NotionID-blog: abc123
---
```

**Behavior:**
- ✅ Detects that the auto sync key is missing
- ✅ Detects existing NotionID (file was synced before)
- ✅ Shows notice: "⚠️ Auto-sync skipped: Add autosync-database to your frontmatter to specify target databases"
- ✅ No sync operation performed
- 📝 **Action Required:** Add `autosync-database: [blog]` to the frontmatter

#### Scenario B: New Document (First-Time Auto Upload)

```yaml
---
title: My New Article
autosync-database: [blog]
---
```

**Behavior:**
- ✅ Detects no NotionID present but `autosync-database` is configured
- ✅ Automatically performs first-time upload to the Blog database
- ✅ Adds `NotionID-blog: xxx` to the frontmatter after successful upload
- ✅ Shows success/failure notification
- 📝 **No Action Required:** The plugin handles the initial upload automatically

#### Scenario C: Synced to One Database

```yaml
---
title: My Article
NotionID-blog: abc123
autosync-database: [blog]
---
```

**Behavior:**
- ✅ Detects 1 NotionID
- ✅ Automatically syncs to the Blog database
- ✅ Shows success/failure notification from the upload command
- 📝 **No Action Required:** Changes are automatically synced

#### Scenario D: Synced to Multiple Databases

```yaml
---
title: My Article  
NotionID-blog: abc123
NotionID-portfolio: def456
NotionID-notes: ghi789
autosync-database: [blog, portfolio, notes]
---
```

**Behavior:**
- ✅ Detects 3 database targets
- ✅ Shows notice: "🔄 Auto sync: Syncing to 3 database(s)..."
- ✅ Syncs to all 3 databases sequentially
- ✅ Shows individual result notifications for each database
- 📝 **No Action Required:** Changes are automatically synced to all linked databases

#### Scenario E: Custom Frontmatter Key

```yaml
---
title: My Article
NotionID-blog: abc123
NotionID-portfolio: def456
🚀-sync-targets: [blog, portfolio]
---
```

**Behavior:**
- ✅ Uses your custom key (for example `🚀-sync-targets`) configured in settings
- ✅ Syncs to the listed databases when NotionIDs are present
- 📝 **Remember:** Update both the setting and your frontmatter if you rename the key
### Auto Sync Best Practices

1. **Add Frontmatter Key**: Just add `autosync-database: [your-db]` to enable auto sync - no manual upload needed
2. **Configure Delay Appropriately**: Set a longer delay (5-10 seconds) if you make frequent edits
3. **Monitor Sync Status**: Check the notifications to ensure syncs complete successfully
4. **Check Logs**: Open the developer console (Ctrl+Shift+I / Cmd+Option+I) to view detailed sync logs

### Troubleshooting

Having issues with auto sync? Check the [Troubleshooting Guide](05-troubleshooting.md) for detailed solutions to common problems.
