---
title: Syncing Notes
description: How to sync your Obsidian notes to Notion using the NotionNext plugin
---

# Syncing Notes

After configuring your Notion database in the plugin settings, you can start syncing your Obsidian notes to Notion.

## Manual Sync

To sync a note, open the note you want to sync and use the "Share to NotionNext" command from the command palette or the note context menu. This will create a new page in your Notion database with the content of your Obsidian note.

## Attachment Upload

The plugin automatically detects and uploads local attachments (images, PDFs, etc.) from your notes to Notion.

### Supported Attachment Formats

**Image formats:**
- PNG, JPG, JPEG, GIF, WebP, SVG, HEIC, TIF, TIFF, BMP

**Other formats:**
- PDF

### Supported Link Formats

Currently supported:

#### Wikilink Format (Recommended)

```markdown
![[image.png]]
![[folder/image.png]]
![[image.png|alt text]]

[[document.pdf]]
[[folder/document.pdf]]
```

#### Standard Markdown Format

```markdown
![alt text](image.png)
![alt text](folder/image.png)
![](./relative/path/image.png)

[document.pdf](document.pdf)
[document.pdf](folder/document.pdf)
```

#### TODO

- [ ] Obsidian URL Format

  ```markdown
  ![](obsidian://open?vault=MyVault&file=path/to/image.png)
  ```

- [ ] App URL Format

  ```markdown
  ![](app://local/path/to/image.png)
  ```

### How Attachment Upload Works

1. **Auto Detection**: During sync, the plugin scans your note content and identifies all local attachment references
2. **Upload to Notion**: Detected attachments are uploaded via the Notion File Upload API
3. **Link Replacement**: After successful upload, local links are replaced with Notion file references
4. **Image Display**: Images are displayed as Notion image blocks
5. **File Embedding**: Non-image files like PDFs are embedded as file blocks

### Notes

- Attachment references inside code blocks are not processed
- External URLs (`http://` or `https://`) are not processed
- Single file size limit is 5MB
- Ensure attachment files exist in your Vault

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
- **Only files with the auto sync key in frontmatter will be processed**
- Files without the auto sync key are silently skipped - no sync operations or notices
- Files containing internal attachments (local images/PDFs) are skipped - sync them manually
- After you stop editing for the configured delay period, auto sync is triggered
- **First-time upload is supported**: No need to manually sync first - just add the frontmatter key and the plugin will handle the initial upload
- If a file is linked to multiple databases, it will sync to all of them automatically
- After the first sync, a `NotionID-{database}` will be added to the frontmatter for future updates

### Auto Sync Scenarios

#### Scenario A: New Document (First-Time Auto Upload)

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

#### Scenario B: Synced to One Database

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

#### Scenario C: Synced to Multiple Databases

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

#### Scenario D: Custom Frontmatter Key

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
