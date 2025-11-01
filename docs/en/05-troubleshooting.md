---
title: Troubleshooting
description: Common issues and solutions for the Obsidian to NotionNext plugin
---

# Troubleshooting

## Auto Sync Issues

### Auto sync not working?

**Possible causes and solutions:**

- **Auto sync not enabled**: Ensure auto sync is enabled in plugin settings under General Settings
- **No NotionID in frontmatter**: Verify the document has a NotionID field (e.g., `NotionID-blog: abc123`) in its frontmatter. Auto sync only works for documents that have been manually synced at least once
- **Invalid database configuration**: Check that your database configuration is valid and the API credentials are correct
- **Console errors**: Look for errors in the developer console (`Ctrl+Shift+I` / `Cmd+Option+I`)

### Sync too frequent?

If auto sync is triggering too often while you're editing:

- **Increase the delay**: Go to plugin settings and increase the "Auto Sync Delay" value (default is 5 seconds)
- **Understanding the delay**: The delay timer resets each time you make an edit, so sync only triggers after you stop editing for the configured duration

### Missing notifications?

If you're not seeing sync notifications:

- **Notification duration**: Notifications appear for 3-6 seconds and then automatically disappear
- **Check console logs**: Open the developer console (`Ctrl+Shift+I` / `Cmd+Option+I`) to view detailed sync information
- **Multiple syncs**: When syncing to multiple databases, you'll see a notification for the multi-database sync plus individual result notifications

### Auto sync skipped for new documents

If you see the message "⚠️ Auto sync skipped: This document has not been synced to Notion, please upload manually first":

- **First sync required**: This is expected behavior. Auto sync only works for documents that already have a NotionID
- **Solution**: Use the command palette (`Ctrl/Cmd + P`) and select "Share to NotionNext" to perform the first manual sync
- **After manual sync**: Once the document has a NotionID in its frontmatter, auto sync will work automatically

## General Sync Issues

### Sync failed with error message

If you see error messages during sync:

1. **Check API credentials**: Verify your Notion API token and Database ID are correct
2. **Check permissions**: Ensure the integration has access to the target database
3. **Network issues**: Check your internet connection
4. **Rate limiting**: Notion has API rate limits; wait a moment and try again
5. **Check console**: Open developer tools to see detailed error information

### Multiple database sync issues

When syncing to multiple databases:

- **Partial failures**: If one database fails, others will still continue syncing
- **Individual notifications**: Each database sync shows its own result notification
- **Check frontmatter**: Verify all NotionID fields are present and correct (e.g., `NotionID-blog`, `NotionID-portfolio`)

## Getting Help

If the problem persists, you can [open an issue on GitHub](https://github.com/jxpeng98/obsidian-to-NotionNext/issues) with detailed error information and the steps you took.

You can find the error logs in Obsidian by going to developer tools (`Ctrl+Shift+I` or `Cmd+Option+I`) and checking the console for any error messages related to the NotionNext plugin.

### What to include in bug reports:

1. **Error messages**: Copy the exact error message from notifications or console
2. **Console logs**: Include relevant logs from the developer console (look for `[AutoSync]`, `[Settings]`, or `[Plugin]` prefixes)
3. **Steps to reproduce**: Describe what you were doing when the issue occurred
4. **Configuration**: Mention which database format you're using (NotionNext, General, or Custom)
5. **Settings**: Note if auto sync is enabled and what delay is configured
