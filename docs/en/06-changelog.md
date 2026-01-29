---
title: Changelog
description: Release notes and updates for Obsidian to NotionNext
---

# Changelog

Welcome to the Changelog for Obsidian to NotionNext! Here you'll find a detailed list of all the updates, improvements, and bug fixes made to the plugin over time from the version `2.7.0` onwards.

## v2.8.0 (2026-01-29)

### Added

- **Auto Sync**: Automatically sync notes on content or frontmatter changes, with configurable delay and multi-database support
- **Attachment Upload**: Upload local images and PDFs to Notion via the File Upload API and insert them as `image`/`file` blocks
- **Auto-copy Notion Link**: Option to copy the Notion page link to clipboard after syncing
- **Auto-sync frontmatter key**: Customize the frontmatter key for auto-sync database lists (default: `autosync-database`)
- Comprehensive i18n support for UI and notifications
- Prerelease workflow for beta testing via GitHub Actions and BRAT

### Changed

- Improved auto-sync behavior and notices for files without `autosync-database` or missing NotionID
- Limited attachment link parsing to **Wikilinks** and **standard Markdown links** (Obsidian/App URL formats are now TODO/disabled)
- Standardized Notion API request header `Notion-Version` to `2025-09-03`
- Reduced per-file upload limit to **5MB** to maximize compatibility across Notion plans
- Enhanced settings tab and documentation for auto-sync usage

### Fixed

- Fixed mobile compatibility issues by using `window.setTimeout` instead of `NodeJS.Timeout`
- Prevented sync loops and improved change detection for frontmatter/body updates
- File placeholder tokens no longer break due to Markdown underscore parsing
- Better block ordering when attachments are on standalone lines in Markdown
- Preserve image captions when converting `external` images to `file_upload`
- Avoid duplicate filename display on uploaded `file` blocks
- Fixed `undefined` appearing in sync success notification by adding missing `sync-preffix` i18n key

## v2.8.0-beta.2 (2025-11-05)

### Featured

- Added setting to customise the frontmatter key used for auto sync database lists (defaults to `autosync-database`)


## v2.8.0-beta.1 (2025-10-31)

### Added

- **Auto Sync Feature**: Automatically sync notes to Notion when content or frontmatter changes
  - Configurable delay (default: 5 seconds, minimum: 2 seconds)
  - Support for multiple database syncing
  - Smart detection to avoid sync loops when only NotionID is updated
  - Content hash comparison to detect body text changes
  - Works on both desktop and mobile platforms
- Added comprehensive i18n support for all UI elements and notifications
- Added prerelease workflow for beta testing via GitHub Actions and BRAT

### Changed

- Enhanced settings tab with auto-sync configuration options
- Improved debug logging for better troubleshooting
- Updated documentation with auto-sync usage guide and troubleshooting section

### Fixed

- Fixed mobile compatibility issues by using `window.setTimeout` instead of `NodeJS.Timeout`
- Fixed sync loop prevention logic to properly handle frontmatter and content changes
- Fixed cache update timing to ensure accurate change detection
