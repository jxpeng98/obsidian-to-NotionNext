---
title: Changelog
description: Release notes and updates for Obsidian to NotionNext
---

# Changelog

Welcome to the Changelog for Obsidian to NotionNext! Here you'll find a detailed list of all the updates, improvements, and bug fixes made to the plugin over time from the version `2.7.0` onwards.

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
