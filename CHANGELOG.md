# Changelog

## v2.8.0-beta.4 (2026-01-04)

### Added

- **Attachment Upload**: Upload local images and PDFs to Notion via the File Upload API and insert them as `image`/`file` blocks
- **Auto-sync safeguard**: Auto-sync is skipped for notes containing internal attachments (manual sync required)

### Changed

- Limited attachment link parsing to **Wikilinks** and **standard Markdown links** (Obsidian/App URL formats are now TODO/disabled)
- Standardized Notion API request header `Notion-Version` to `2025-09-03`
- Reduced per-file upload limit to **5MB** to maximize compatibility across Notion plans

### Fixed

- File placeholder tokens no longer break due to Markdown underscore parsing
- Better block ordering when attachments are on standalone lines in Markdown
- Preserve image captions when converting `external` images to `file_upload`
- Avoid duplicate filename display on uploaded `file` blocks

---

## v2.8.0-beta.3 (2025-12-10)

### Added

- **Auto-copy Notion Link setting**: New toggle to automatically copy the Notion page link to clipboard after syncing (defaults to on)
- **Smart auto-sync notice**: Show notice only for files that were previously synced but missing `autosync-database` field; new files are silently skipped

### Fixed

- Fixed `undefined` appearing in sync success notification by adding missing `sync-preffix` i18n key
- Fixed build error caused by removed `resetAutoSyncNoticeCache()` method reference
- Added `autoCopyNotionLink` to settings migration logic for seamless upgrades

### Changed

- Improved auto-sync behavior: files without `autosync-database` are now silently ignored unless they have an existing NotionID
- Updated documentation with new auto-sync scenarios (A-1 and A-2)

---

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
- Added setting to customise the frontmatter key used for auto sync database lists (defaults to `autosync-database`)

### Changed

- Enhanced settings tab with auto-sync configuration options
- Improved debug logging for better troubleshooting
- Updated documentation with auto-sync usage guide and troubleshooting section

### Fixed

- Fixed mobile compatibility issues by using `window.setTimeout` instead of `NodeJS.Timeout`
- Fixed sync loop prevention logic to properly handle frontmatter and content changes
- Fixed cache update timing to ensure accurate change detection
